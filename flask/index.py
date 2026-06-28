from datetime import datetime
import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from models import db, Activity, Story
from waitress import serve

import logging
from modules.logging_config import setup_logging
from modules.utils import handleNextRequest

# ---- CONFIG ----
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "instance", "mydata.db")
TMP_DIR = os.path.join(BASE_DIR, "tmp")

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".pptx", ".doc", ".xls", ".png", ".jpg", ".jpeg", ".csv"}
MAX_REQUEST_BYTES = 16 * 1024 * 1024   # 16 MB — Flask rejects the request before it hits the route
MAX_TMP_BYTES     = 200 * 1024 * 1024  # 200 MB — total cap on the staging folder

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + DB_PATH
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "super-secret-key"
    app.config["MAX_CONTENT_LENGTH"] = MAX_REQUEST_BYTES

    db.init_app(app)
    Migrate(app, db)


    # ---- Activity Routes ----
    
    # @app.route("/flask/create-activity/", methods=["POST"])
    def create_activity():
        logger.info("Route /flask/create-activity/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        formData = next_request["formData"]

        # Convert ISO date strings to datetime
        if "status" in formData and isinstance(formData["status"], str):
            formData["status"] = datetime.fromisoformat(formData["status"])
        if "submissionDate" in formData and isinstance(formData["submissionDate"], str):
            formData["submissionDate"] = datetime.fromisoformat(formData["submissionDate"])

        new_activity = Activity(**formData)
        db.session.add(new_activity)
        db.session.commit()

        message = f"Created new Activity with ssapId {new_activity.ssapId}"
        logger.info(message)

        return jsonify({
            "status": "success",
            "message": message,
            "fetchData": {"activity": new_activity.to_dict()}
        }), 201


    # @app.route("/flask/update-activity/", methods=["POST"])
    def update_activity(data):
        logger.info("Updating Activity.")

        ssapId = data.get("ssapId")

        activity = Activity.query.filter_by(ssapId=ssapId).first_or_404()

        for key, value in data.items():
            if hasattr(activity, key):
                if key in ["status", "submissionDate"] and isinstance(value, str):
                    value = datetime.fromisoformat(value)
                setattr(activity, key, value)

        db.session.commit()

        message = f"Updated Activity with ssapId {ssapId}"
        logger.info(message)

    # @app.route("/flask/delete-activity/", methods=["POST"])
    def delete_activity():
        logger.info("Route /flask/delete-activity/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        ssapId = next_request["formData"].get("itemId")

        activity = Activity.query.filter_by(ssapId=ssapId).first_or_404()
        db.session.delete(activity)
        db.session.commit()

        message = f"Deleted Activity with ssapId {ssapId}"
        logger.info(message)

        return jsonify({"status": "success", "message": message})


    # @app.route("/flask/get-activities/", methods=["POST"])
    def get_activities():
        logger.info("Route /flask/get-activities/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        activities = Activity.query.all()
        message = f"Fetched {len(activities)} activities from DB."
        logger.info(message)

        return {
            "status": "success",
            "message": message,
            "fetchData": {"activities": [a.to_dict() for a in activities]}
        }
        
        
    @app.route("/flask/activity/<ssap_id>", methods=["GET"])
    def get_activity(ssap_id):
        logger.info("Route /flask/activity/%s was reached with method GET", ssap_id)
        activity = Activity.query.filter_by(ssapId=ssap_id).first_or_404()
        return jsonify({"status": "success", "activity": activity.to_dict()})

    # ---- Upload Routes ----

    @app.route("/flask/multiple-uploads/", methods=["POST"])
    def upload_multiple_files():
        logger.info("Route /flask/multiple-uploads/ was reached with method POST")

        slug = request.form.get("slug", "")
        files = request.files.to_dict()

        slug_dir = os.path.join(TMP_DIR, secure_filename(slug)) if slug else TMP_DIR
        os.makedirs(slug_dir, exist_ok=True)

        tmp_size = sum(
            os.path.getsize(os.path.join(root, f))
            for root, _, files in os.walk(TMP_DIR)
            for f in files
        )
        if tmp_size >= MAX_TMP_BYTES:
            logger.warning("Upload rejected: tmp folder size cap reached (%d bytes)", tmp_size)
            return jsonify({"status": "error", "message": "Upload storage is full."}), 507

        saved = []
        for key, file in files.items():
            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                logger.warning("Rejected file %s: extension not allowed", file.filename)
                return jsonify({"status": "error", "message": f"File type '{ext}' is not allowed."}), 415

            file_name = secure_filename(file.filename)
            if not file_name:
                return jsonify({"status": "error", "message": "Invalid filename."}), 400

            file_path = os.path.join(slug_dir, file_name)
            file.save(file_path)
            saved.append(file_name)
            logger.debug("Saved %s (%d bytes) under slug %s", file_name, os.path.getsize(file_path), slug)

        return jsonify({"status": "success", "message": f"Uploaded: {', '.join(saved)}."})

    @app.route("/flask/files/", methods=["GET"])
    def list_files():
        slug = request.args.get("slug", "")
        if not slug:
            return jsonify({"status": "error", "message": "slug is required"}), 400

        slug_dir = os.path.join(TMP_DIR, secure_filename(slug))
        if not os.path.isdir(slug_dir):
            return jsonify({"status": "success", "files": []})

        files = [f for f in os.listdir(slug_dir) if os.path.isfile(os.path.join(slug_dir, f))]
        return jsonify({"status": "success", "files": files})

    @app.route("/flask/file/<slug>/<filename>", methods=["GET"])
    def serve_file(slug, filename):
        slug_dir = os.path.join(TMP_DIR, secure_filename(slug))
        safe_name = secure_filename(filename)
        if not safe_name:
            return jsonify({"status": "error", "message": "Invalid filename"}), 400
        return send_from_directory(slug_dir, safe_name)

    @app.route("/flask/file/<slug>/<filename>", methods=["DELETE"])
    def delete_file(slug, filename):
        slug_dir = os.path.join(TMP_DIR, secure_filename(slug))
        safe_name = secure_filename(filename)
        if not safe_name:
            return jsonify({"status": "error", "message": "Invalid filename"}), 400
        file_path = os.path.join(slug_dir, safe_name)
        if not os.path.isfile(file_path):
            return jsonify({"status": "error", "message": "File not found"}), 404
        os.remove(file_path)
        logger.info("Deleted file %s under slug %s", safe_name, slug)
        return jsonify({"status": "success", "message": f"Deleted {safe_name}."})

    # ---- Story Routes ----

    @app.route("/flask/create-story/", methods=["POST"])
    def create_story():
        logger.info("Route /flask/create-story/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        transferData = {
            "childActivities": next_request['childActivities'],
            # "listName": next_request['listName'],
            "Title": next_request['storyName'],
            "ssapId": next_request['storyId'],
            "storyAuthor": next_request['story_author'],
            "submittedBy": next_request['story_author'],
            "submissionDate": next_request['story_birth'],
        } 

        # if "status" in transferData and isinstance(transferData["status"], str):
        #     transferData["status"] = datetime.fromisoformat(transferData["status"])
        if "submissionDate" in transferData and isinstance(transferData["submissionDate"], str):
            transferData["submissionDate"] = datetime.fromisoformat(
                transferData["submissionDate"].replace("Z", "+00:00")
            )

        new_story = Story(**transferData)
        db.session.add(new_story)
        db.session.commit()

        message = f"Created new Story with ssapId {new_story.ssapId}"
        logger.info(message)

        return jsonify({
            "status": "success",
            "message": message,
            "fetchData": {"story": new_story.to_dict()}
        }), 201


    # @app.route("/flask/update-story/", methods=["POST"])
    def update_story(data):
        logger.info("Updating Story.")

        ssapId = data.get("ssapId")

        story = Story.query.filter_by(ssapId=ssapId).first_or_404()

        for key, value in data.items():
            if hasattr(story, key):
                if key in ["status", "submissionDate"] and isinstance(value, str):
                    value = datetime.fromisoformat(value)
                setattr(story, key, value)

        db.session.commit()

        message = f"Updated Story with ssapId {ssapId}"
        logger.info(message)

    # @app.route("/flask/delete-story/", methods=["POST"])
    def delete_story(story):
        logger.info("Route /flask/delete-story/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        # ssapId = next_request["formData"].get("itemId")

        story = Story.query.filter_by(ssapId=story).first_or_404()
        db.session.delete(story)
        db.session.commit()

        message = f"Deleted Story with ssapId {story}"
        logger.info(message)

        return jsonify({"status": "success", "message": message})


    @app.route("/flask/get-stories/", methods=["POST"])
    def get_stories():
        logger.info("Route /flask/get-stories/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        stories = Story.query.all()
        message = f"Fetched {len(stories)} stories from DB."
        logger.info(message)

        return {
            "status": "success",
            "message": message,
            "fetchData": {"stories": [s.to_dict() for s in stories]}
        }


    # ---- Overall routes ----
    # Used by forms to push data to the SPO
    @app.route('/flask/post-ssap/', methods=["POST"])
    def postSSAP():
        logger.info("Route flask/post-ssap/ was reached with method POST")
        
        data = request.get_json()
        next_request = handleNextRequest(data)

        formData = next_request['formData']
        listName = next_request['listName']
        lastAuthor = next_request['story_last_author']
        lastModifiedOn = next_request['story_modified_on']
        
        if listName == "SSAP_list_of_activities":

            transferData = {
                "ssapId": formData.get("itemId", False), 
                "arap_Description": formData.get("description", False),
                "author0": formData.get("author", False),
                "impact1": formData.get("impact1", False),
                "impact2": formData.get("impact2", False),
                "impact3": formData.get("impact3", False),
                "esaInternal": formData.get("esaInternal", False),
            }

            logger.info(f"SSAP ID of the activity to update : {transferData["ssapId"]}")
            logger.debug("Data to push :\n", transferData)

            update_activity(transferData)
            
            message = f"Pushing forms data relative to item {transferData["ssapId"]} to {listName}."
        
            logger.info(message)
            
            activity = Activity.query.filter_by(ssapId=transferData['ssapId']).first_or_404()
            
            return jsonify({
                "status": "success",
                "message": message,
                "fetchData": {"activity": activity.to_dict()}
            })
            
        elif listName == "SSAP_list_of_stories":

            transferData = {
                "ssapId": formData.get("itemId", False),
                "Title": formData.get("title", False),
                "storyDescription": formData.get("description", False),
                "storyAuthor": formData.get("author", False),
                "contractNumber1": formData.get("contractNumber1", False),
                "contractNumber2": formData.get("contractNumber2", False),
                "contractNumber3": formData.get("contractNumber3", False),
                "contractNumber4": formData.get("contractNumber4", False),
                "contractNumber5": formData.get("contractNumber5", False),
                "customer1": formData.get("customer1", False),
                "customer2": formData.get("customer2", False),
                "customer3": formData.get("customer3", False),
                "customer4": formData.get("customer4", False),
                "customer5": formData.get("customer5", False),
                "impact1": formData.get("impact1", False),
                "impact2": formData.get("impact2", False),
                "impact3": formData.get("impact3", False),
                "esaInternal": formData.get("esaInternal", False),
                "lastAuthor": lastAuthor,
                "lastModifiedOn": lastModifiedOn,
                'customers': formData.get("customers", False),
            }

            logger.info(f"Title of the story to update : {transferData["Title"]}")
            logger.info(f"SSAP ID of the story to update : {transferData["ssapId"]}")
            logger.debug("Data to push :\n", transferData)

            update_story(transferData)
              
            message = f"Pushing forms data relative to item {transferData["ssapId"]} to {listName}."
        
            logger.info(message)
            
            story = Story.query.filter_by(ssapId=transferData['ssapId']).first_or_404()
            
            return jsonify({
                "status": "success",
                "message": message,
                "fetchData": {"story": story.to_dict()}
            })


    # Used by all pages including tables or forms to use the latest SPO data regarding a story or an activity.
    # Cases : only table (create story, browse story), only form (edit activity), table + form (edit story)
    @app.route("/flask/refresh-app/", methods=["POST"])
    def refreshApp():
        logger.info("Route flask/refresh-app/ was reached with method POST")

        data = request.get_json()
        next_request = handleNextRequest(data)

        slug = next_request['slug']
        folder = next_request['folder']
        listName = next_request['listName']
        export = next_request['export']
        
        # Refresh Table values with stories or activities (story-page or activity-page)
        if (listName and not slug):
            
            itemType = listName.split('_')[3]
            message = f"Refreshing table with {listName}'s {itemType}."
            logger.info(message)

            if itemType == "stories":
                output = get_stories()
                logger.info("Refreshing Story table")
                # outputData = {
                #     "stories": output
                # }

            elif itemType == "activities":
                output = get_activities()
                logger.info("Refreshing Activity table")
                # outputData = {
                #     "activities": output
                # }

            res = jsonify(output)
            
            return res

        # Refresh Table values with related activities (edit-story only)
        elif (listName == 'SSAP_list_of_activities' and slug and not folder):
            logger.info("Refreshing Related-Activity table")

            item = Story.query.filter_by(ssapId=slug).first()
            if not item:
                return jsonify({"status": "success", "message": f"Story {slug} not found.", "fetchData": {"relatedActivities": {}}}), 200

            childs = item.childActivities

            output = {}

            if childs:
                childs = childs.split(",")

                message = f"Refreshing Table values with related activities for story {slug} : {childs}"
                logger.info(message)

                for child in childs:
                    tmp = Activity.query.filter_by(ssapId=child).first()
                    if tmp:
                        logging.debug(f'Tmp activity : {tmp.to_dict()}')
                        output.update({f'{child}': tmp.to_dict()})

            else:
                message = f"No related activities for story {slug}."
                logger.info(message)
            
            outputData = {
                "relatedActivities": output
            }
            logging.debug(f'Output : {output}')
            
            res = jsonify({
                "status": "success",
                "message": message + "Success.",
                "fetchData": outputData
                })
            
            return res

        # Refresh Form and Files values (story-form and soon activity-form will integrate file fetching too)
        elif (slug and folder):

            # item = getItem(ctx, listName, slug)
            # files = getFiles(ctx, folder)
            
            itemType = slug.split('_')[0]

            message = f"Refreshing Form and Files with {listName}'s for {slug}."
            logger.info(message)

            if itemType == "story":
                logger.info("Refreshing Story form")
                item = Story.query.filter_by(ssapId=slug).first()
                outputData = {"story": item.to_dict()} if item else {}

            elif itemType == "activity":
                logger.info("Refreshing Activity form")
                item = Activity.query.filter_by(ssapId=slug).first()
                outputData = {"activity": item.to_dict()} if item else {}

            logger.debug(outputData)

            res = jsonify({
                "status": "success",
                "message": message + "Success.",
                "fetchData": outputData
                })
            
            return res
    
    @app.route("/flask/update-table/", methods=["POST"])
    def updateTable():
        
        logger.info("'/flask/update-table/' was reached with 'POST' method.")

        data = request.get_json()
        next_request = handleNextRequest(data)

        listName = next_request['listName']
        dissociatedActivities = next_request['dissociatedActivities']
        deletedStories = next_request['deletedStories']
        story = next_request['story']


        if deletedStories:
            # deleteItems(ctx, listName, deletedStories)
            for story in deletedStories:
                delete_story(story)
            message = f"Stories {deletedStories} were successfully moved to recycle bin."
            logger.info(message)
            
        elif dissociatedActivities and story:
            # dissociateItems(ctx, listName, dissociatedActivities, story)
            story = Story.query.filter_by(ssapId=story).first_or_404()
            tmp = story.childActivities.split(',')
            
            for activity in dissociatedActivities:
                tmp.remove(activity)
                
            value = ','.join(tmp)
            
            setattr(story, 'childActivities', value)
            
            db.session.commit()
            
            message = f"Activities {deletedStories} were successfully unassociated from story {story}."
            logger.info(message)


        return jsonify({
            "status": "success",
            "message": message + "Success."
            })

    # Used by edit-story to create a new success story on the SPO (story name, ssapId and childActivities)
    @app.route("/flask/associate-activity/", methods=["POST"])
    def associateActivity():
        
        logger.info("'/flask/associate-activity/' was reached with 'POST' method.")

        data = request.get_json()
        next_request = handleNextRequest(data)

        associatedActivities = next_request['associatedActivities'].split(',')
        listName = next_request['listName']
        storyId = next_request['storyId']


        message = f"Associating {associatedActivities} with story {storyId}. "
        logger.info(message)

        # updateActivityAssociate(ctx, associatedActivities, listName, storyId)
        story = Story.query.filter_by(ssapId=storyId).first_or_404()
        tmp = story.childActivities.split(',')
        
        for activity in associatedActivities:
            tmp.append(activity)
            
        value = ','.join(tmp)
        
        setattr(story, 'childActivities', value)

        db.session.commit()
        
        
        res = jsonify({
            "status": "success",
            "message": message + "Success."
            })

        return res
      
    # Used by forms to push data to the SPO
    # @app.route('/flask/post-ssap/', methods=["POST"])
    # def postSSAP():

    #     logger.info("Route flask/post-ssap/ was reached with method POST")
        
    #     data = request.get_json()
    #     next_request = handleNextRequest(data)

    #     formData = next_request['formData']
    #     listName = next_request['listName']
    #     lastAuthor = next_request['story_last_author']
    #     lastModifiedOn = next_request['story_modified_on']
    #     # formatedEntries = next_request['formatedEntries']

    #     if listName == "SSAP_list_of_activities":

    #         transferData = {
    #             "ssapId": formData.get("itemId", False), 
    #             "arap_Description": formData.get("description", False),
    #             "author0": formData.get("author", False),
    #             "impact1": formData.get("impact1", False),
    #             "impact2": formData.get("impact2", False),
    #             "impact3": formData.get("impact3", False),
    #             "esaInternal": formData.get("esaInternal", False),
    #         }

    #         logger.info(f"SSAP ID of the activity to update : {transferData["ssapId"]}")
    #         logger.debug("Data to push :\n", transferData)
            
    #         activity = Activity.query.filter_by(ssapId=transferData[["ssapId"]]).first_or_404()
            
    #         for key, val in transferData:
    #             setattr(activity, key, val)
                
    #         db.session.commit()
                

    #     elif listName == "SSAP_list_of_stories":

    #         transferData = {
    #             "ssapId": formData.get("itemId", False),
    #             "Title": formData.get("title", False),
    #             "storyDescription": formData.get("description", False),
    #             "storyAuthor": formData.get("author", False),
    #             "contractNumber1": formData.get("contractNumber1", False),
    #             "contractNumber2": formData.get("contractNumber2", False),
    #             "contractNumber3": formData.get("contractNumber3", False),
    #             "contractNumber4": formData.get("contractNumber4", False),
    #             "contractNumber5": formData.get("contractNumber5", False),
    #             "customer1": formData.get("customer1", False),
    #             "customer2": formData.get("customer2", False),
    #             "customer3": formData.get("customer3", False),
    #             "customer4": formData.get("customer4", False),
    #             "customer5": formData.get("customer5", False),
    #             "impact1": formData.get("impact1", False),
    #             "impact2": formData.get("impact2", False),
    #             "impact3": formData.get("impact3", False),
    #             "esaInternal": formData.get("esaInternal", False),
    #             "lastAuthor": lastAuthor,
    #             "lastModifiedOn": lastModifiedOn,
    #             'customers': formData.get("customers", False),
    #         }

    #         logger.info(f"Title of the story to update : {transferData["Title"]}")
    #         logger.info(f"SSAP ID of the story to update : {transferData["ssapId"]}")
    #         logger.debug("Data to push :\n", transferData)

            
    #         story = Story.query.filter_by(ssapId=transferData[["ssapId"]]).first_or_404()
            
    #         for key, val in transferData:
    #             setattr(story, key, val)
                
    #         db.session.commit()

    #     message = f"Pushing forms data relative to item {transferData["ssapId"]} to {listName}."
    #     logger.info(message)

    #     res = jsonify({
    #         "status": "success",
    #         "message": message + "Success."
    #         })

    #     return res

    return app

PORT = int(os.environ.get('PORT', 5050))
HOST = os.environ.get('FLASK_HOST', '127.0.0.1')
DEV_LOGS = 'logs/dev_flask-logs.log'
PROD_LOGS = 'logs/prod_flask-logs.log'

# ---- ENTRY POINT ----
if __name__ == "__main__":

    os.makedirs(os.path.join(BASE_DIR, "instance"), exist_ok=True)
    app = create_app()

    if "dev" in sys.argv:
        logger = setup_logging(DEV_LOGS, console_level=logging.INFO, file_level=logging.DEBUG)
        logs = DEV_LOGS
        logger.debug(sys.argv)

        # ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)
        # scheduler = BackgroundScheduler()
        # job = scheduler.add_job(scheduled_authentication, 'interval', hours=6,next_run_time=datetime.now())
        # scheduler.start()

        app.run(host=HOST, port=PORT)
    else:
        logger = setup_logging(PROD_LOGS, console_level=logging.INFO, file_level=logging.DEBUG)
        logs = PROD_LOGS
        logger.debug(sys.argv)

        # ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

        # scheduler = BackgroundScheduler()
        # job = scheduler.add_job(scheduled_authentication, 'interval', hours=6,next_run_time=datetime.now())
        # scheduler.start()

        serve(app, host=HOST, port=PORT)