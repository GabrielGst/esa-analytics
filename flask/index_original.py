from waitress import serve
import os
import sys

from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS, cross_origin # type: ignore
from werkzeug.utils import secure_filename # type: ignore # secure_filename() sanitizes the filename to prevent path traversal (e.g., no ../../evil.py).

import logging
from modules.logging_config import setup_logging
from dotenv import load_dotenv

# Periodic trigger of sharepoint authentication
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

from modules.post_list import postListData
from modules.get_list import getListData
from modules.file_upload import uploadFile
from modules.get_files import getFiles
from modules.get_item import getItem
from modules.create_item import postItem
from modules.delete_item import deleteItems
from modules.dissociate_activities import dissociateItems
from modules.associate_activity import updateActivityAssociate
from modules.utils import authenticate, handleNextRequest


load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
SITE_NAME = os.getenv('SITE_NAME')

DEV_LOGS = os.getenv('DEV_LOGS')
PROD_LOGS = os.getenv('PROD_LOGS')

PORT = os.getenv('PORT')



########################################
############### MAIN SPO ###############
########################################

def createApp():
    """Core routing function that will then be run.

    Returns:
        function: flask routing function configured to run through flask or WSGI serving
    """    

    app = Flask(__name__)
    # CORS(app, origins=["http://localhost:4000", "http://industry-analytics-dev.go.esa.int"]) # Enable CORS for all domains and routes
    CORS(app)
    # CORS(app, resources={r"/flask/*": {"origins": "*"}}, methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"])


    ##########################################
    ############### ROUTES SPO ###############
    ##########################################


    # Simple fetch checking if server is online and reachable
    @app.route("/flask/healthchecker/", methods=["GET"])
    def healthchecker():
        logger.info("Route flask/healthchecker was reached with method GET")

        return jsonify({
            "status": "success",
            "message": "Health s good"
            }) # {"status": "success", "message": "Integrate Flask Framework with Next.js"}


    ############### POSTING ROUTES ###############

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
        # formatedEntries = next_request['formatedEntries']


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


        message = f"Pushing forms data relative to item {transferData["ssapId"]} to {listName}."
        logger.info(message)

        postListData(ctx, transferData, listName)

        res = jsonify({
            "status": "success",
            "message": message + "Success."
            })

        return res

    # Used by forms to push files to the SPO || AON, only the story form does this, while the activity forms should integrate the file uploader now in the edit page
    @app.route("/flask/multiple-uploads/", methods=["POST"])
    def uploadMultipleFile():
        logger.info("Route flask/upload/ was reached with method POST")

        slug = request.form.get("slug")
        files = request.files.to_dict() # .get('file')
        filtering = slug.split("_")[0]
        logger.debug(f"Files: {files}")

        for key in files:
            file =  files[key]
            fileName = secure_filename(file.filename)  # this is a FileStorage object
            fileType = file.content_type  # this is a FileStorage object

            # if not file:
            #     return "No file uploaded", 400
            logger.debug(f"Received file {fileName} of type {fileType} under slug {slug}.")

            
            fileSize = len(file.read())
            file.stream.seek(0)  # Reset to allow further use
            
            filePath = f"flask/tmp/{fileName}"
            file.save(filePath)


            fileData = {
                "size": fileSize,
                "name": fileName,
                "path": filePath,
                "filtering": filtering
            }

            uploadFile(ctx, fileData, slug)

        res = jsonify({"status": "success", "message": f"Uploading file success."})

        return res
    
    # Used by edit-story to create a new success story on the SPO (story name, ssapId and childActivities)
    @app.route("/flask/create-story/", methods=["POST"])
    def createStory():
        
        logger.info("'/flask/create-story/' was reached with 'POST' method.")
        
        data = request.get_json()
        next_request = handleNextRequest(data)

        childActivities = next_request['childActivities']
        listName = next_request['listName']
        storyName = next_request['storyName']
        storyId = next_request['storyId']
        storyAuthor = next_request['story_author'] 
        storyBirth = next_request['story_birth'] 


        message = f"{storyAuthor} is creating Story {storyName} with storyId {storyId}."
        logger.info(message)

        postItem(ctx, childActivities, listName, storyName, storyId, storyAuthor, storyBirth)

        # outputData = {
        #     "activites": childActivities,
        #     "story name": storyName,
        #     "story id": storyId
        # }

        res = jsonify({
            "status": "success",
            "message": message + "Success."
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
            deleteItems(ctx, listName, deletedStories)
            message = f"Stories {deletedStories} were successfully moved to recycle bin."
            logger.info(message)
            
        elif dissociatedActivities and story:
            dissociateItems(ctx, listName, dissociatedActivities, story)
            message = f"Activities {deletedStories} were successfully unassociated from story {story}."
            logger.info(message)


        res = jsonify({
            "status": "success",
            "message": message + "Success."
            })

        return res
    
    # Used by edit-story to create a new success story on the SPO (story name, ssapId and childActivities)
    @app.route("/flask/associate-activity/", methods=["POST"])
    def associateActivity():
        
        logger.info("'/flask/associate-activity/' was reached with 'POST' method.")

        data = request.get_json()
        next_request = handleNextRequest(data)

        associatedActivities = next_request['associatedActivities']
        listName = next_request['listName']
        storyId = next_request['storyId']


        message = f"Associating {associatedActivities} with story {storyId}. "
        logger.info(message)

        updateActivityAssociate(ctx, associatedActivities, listName, storyId)

        res = jsonify({
            "status": "success",
            "message": message + "Success."
            })

        return res
    

    ############### FETCHING ROUTES ###############

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
            output = getListData(ctx, listName, export=export)
            itemType = listName.split('_')[3]
            message = f"Refreshing table with {listName}'s {itemType}."
            logger.info(message)

            if itemType == "stories":
                logger.info("Refreshing Story table")
                outputData = {
                    "stories": output
                }

            elif itemType == "activities":
                logger.info("Refreshing Activity table")
                outputData = {
                    "activities": output
                }

            res = jsonify({
                "status": "success",
                "message": message + "Success.",
                "fetchData": outputData
                })
            
            return res

        # Refresh Table values with related activities (edit-story only)
        elif (listName == 'SSAP_list_of_activities' and slug and not folder):
            logger.info("Refreshing Related-Activity table")
                            
            item = getItem(ctx, "SSAP_list_of_stories", slug)

            childActivities = item[slug]["childActivities"]

            output = {}

            if childActivities:
                childActivities = childActivities.split(",")

                message = f"Refreshing Table values with related activities for story {slug} : {childActivities}"
                logger.info(message)

                for child in childActivities:
                    tmp = getItem(ctx, listName, child)
                    # output[child] = tmp
                    output.update(tmp)
            
            else:
                message = f"No related activities for story {slug}."
                logger.info(message)
            
            outputData = {
                "relatedActivities": output
            }
            
            res = jsonify({
                "status": "success",
                "message": message + "Success.",
                "fetchData": outputData
                })
            
            return res

        # Refresh Form and Files values (story-form and soon activity-form will integrate file fetching too)
        elif (slug and folder):

            item = getItem(ctx, listName, slug)
            files = getFiles(ctx, folder)
            
            itemType = slug.split('_')[0]

            message = f"Refreshing Form and Files with {listName}'s for {slug}."
            logger.info(message)

            if itemType == "story":
                logger.info("Refreshing Story form")
                outputData = {
                    "files": files,
                    "story": item
                }

            elif itemType == "activity":
                logger.info("Refreshing Activity form")
                outputData = {
                    "files": files,
                    "activity": item
                }

            logger.debug(outputData)

            res = jsonify({
                "status": "success",
                "message": message + "Success.",
                "fetchData": outputData
                })
            
            return res
        
    return app



##########################################
############### DEPLOY SPO ###############
##########################################

def deploy(app, portNumber, dev):
    """Serves the flask server in DEV or PROD version.

    Args:
        app (flask function): callable flask routing function to run
        portNumber (number): ENV VAR PORT port number for the flask server to run to 
        dev (string): arguments got from the command line / script
    """    

    if dev:
        logger.info(f"Using flask built-in app.run() with port {portNumber} for DEV purpose.")
        logger.info(f"""ENV VAR:\n
            CLIENT_ID: {CLIENT_ID}\n
            CLIENT_SECRET: {CLIENT_SECRET}\n
            SITE_NAME: {SITE_NAME}\n
            DEV_LOGS: {DEV_LOGS}\n
            PROD_LOGS: {PROD_LOGS}\n
            PORT: {PORT}\n
        """)

        app.run(host='127.0.0.1', port=portNumber)
    elif not dev:
        logger.info(f"Using Waitress serve() with port {portNumber} for PROD purpose.")
        logger.info(f"""ENV VAR:\n
            CLIENT_ID: {CLIENT_ID}\n
            CLIENT_SECRET: {CLIENT_SECRET}\n
            SITE_NAME: {SITE_NAME}\n
            DEV_LOGS: {DEV_LOGS}\n
            PROD_LOGS: {PROD_LOGS}\n
            PORT: {PORT}\n
        """)

        serve(app, host='127.0.0.1', port=portNumber)
    else:
        logger.info('Please enter <dev> or no arguments when calling index.py app.')



# Global variable to hold the returned object
ctx = None

# Wrapper to store the return value
def scheduled_authentication():
    global ctx
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)
    logger.info(f"Autenticated to Sharepoint at {datetime.now()}")


if __name__ == "__main__":
    
    app = createApp()

    if "dev" in sys.argv:
        logger = setup_logging(DEV_LOGS, console_level=logging.INFO, file_level=logging.DEBUG)
        logs = DEV_LOGS
        logger.debug(sys.argv)

        # ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)
        scheduler = BackgroundScheduler()
        job = scheduler.add_job(scheduled_authentication, 'interval', hours=6,next_run_time=datetime.now())
        scheduler.start()
        deploy(app, PORT, dev=True)
    else:
        logger = setup_logging(PROD_LOGS, console_level=logging.INFO, file_level=logging.DEBUG)
        logs = PROD_LOGS
        logger.debug(sys.argv)

        # ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)
        
        scheduler = BackgroundScheduler()
        job = scheduler.add_job(scheduled_authentication, 'interval', hours=6,next_run_time=datetime.now())
        scheduler.start()
        deploy(app, PORT, dev=False)