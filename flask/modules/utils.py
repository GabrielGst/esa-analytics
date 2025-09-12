"""
Gabriel Gostiaux
2025/07/03

Python utility module.

"""

import logging

# Create a logger object
logger = logging.getLogger(__name__)

activityWhiteFilter = [
    "ssapId",
    "Title",
    "contractNumber", 
    "country", 
    "fundCode", 
    "title0", 
    "status", 
    "supplierCode", 
    "supplierName", 
    "trls", 
    "technicalOfficer", 
    "lastAuthor", 
    "scheme",
    # editable fields
    "description", 
    "author0", 
    "impact1", 
    "impact2", 
    "impact3", 
    "esaInternal",
    "type" ,
    "scheme",
    "arap_PlannedStartTRL",
    "arap_PlannedEndTRL",
    "arap_Description",
    "arap_StartofActivity",
    "arap_EED",
    "arap_ProspectforUse",
    "arap_PerformanceofCompagny",
    "arap_Note",
    "arap_OverallAmount",
    "arap_lastModifiedOn",
]

storyWhiteFilter = [
    "childActivities", 
    "storyStatus", 
    "storyId", 
    # editable fields
    "Title", 
    "storyDescription", 
    "storyAuthor", 
    "contractNumber1", 
    "contractNumber2", 
    "contractNumber3", 
    "contractNumber4", 
    "contractNumber5", 
    "customers",
    "customer1", 
    "customer2", 
    "customer3", 
    "customer4", 
    "customer5", 
    "impact1", 
    "impact2", 
    "impact3", 
    "esaInternal",
    "ssapId",
    "country",
    "fundCode",
    "title",
    "status",
    "pptReport",
    "description",
    "supplierName",
    "numberOfActivities",
    "yearAchievement",
    "submissionDate",
    "esaInternal",
    "author",
    "lastAuthor",
    "lastModifiedOn",
    "type",
]
############### FUNCTIONS SPO ###############

from office365.sharepoint.client_context import ClientContext


def authenticate(client_id, client_secret, site_name, logger):
    """This functions authenticate the flask server onto the SPO site.

    Args:
        client_id (str): ENV VAR CLIENT_ID
        client_secret (str): EN VAR CLIENT_SECRET
        site_name (str): ENV VAR SITE_NAME
        logger (function): output of setup_logging in main files or logging.getLogger() in modules

    Returns:
        function: returns callable SPO context for REST API function calls.
    """    

    ctx = ClientContext(site_name).with_client_credentials(
        client_id, client_secret
    )

    target_web = ctx.web.get().execute_query()

    logger.info(target_web.url)

    return ctx



def handleNextRequest(data):
    """Converts the Next Request to a python dictionnary

    Args:
        data (object): Next Request in JSON

    Returns:
        dict: next parameters in python dict format
    """
    
    logger.info(data)

    ##### Payload #####
    payload = data.get("payload", {})

    formData = payload.get("formData", False) # For pushing to SPO through post-ssap route
    childActivities = payload.get("childActivities", False) # For create-story
    dissociatedActivities = payload.get("dissociatedActivities", False) # For create-story
    deletedStories = payload.get("deletedStories", False) # For create-story
    story = payload.get("slug", False)
    associatedActivities = payload.get("associatedActivities", False) # For create-story
    story_author = payload.get("storyAuthor", False) # For create-story
    story_birth = payload.get("storyBirth", False) # For create-story
    story_last_author = payload.get("lastAuthor", False) # For update-story
    story_modified_on = payload.get("lastModifiedOn", False) # For update-story
    # formatedEntries = payload.get("formatedEntries", False) # For update-story


    ##### Flags #####
    flags = data.get("flags", {})
    
    slug = flags.get("slug", False)
    folder = flags.get("folder", False) # "Shared Documents/SSAP/4_NATIONAL"
    listName = flags.get("listName", False)
    export = flags.get("exportStatus", False)
    storyName = flags.get("storyName", False) # For create-story
    storyId = flags.get("storyId", False) # For create-story

    var = {
        'formData': formData,
        'childActivities': childActivities,
        'dissociatedActivities': dissociatedActivities,
        'deletedStories': deletedStories,
        'story': story,
        'associatedActivities': associatedActivities,
        'slug': slug,
        'folder': folder,
        'listName': listName,
        'export': export,
        'storyName': storyName,
        'storyId': storyId,
        'story_author' : story_author,
        'story_birth': story_birth,
        'story_last_author': story_last_author,
        'story_modified_on': story_modified_on,
        # 'formatedEntries': formatedEntries,
    }
    
    next_request = dict(var)

    return next_request
    