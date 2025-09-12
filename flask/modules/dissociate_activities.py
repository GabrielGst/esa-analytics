"""
Gabriel Gostiaux
2025/05/30

Python module defining a SharePoint list unassociate function (update a List Item from a List) that works with the Office365 REST Python API.
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging


# Create a logger object
logger = logging.getLogger(__name__)



############### MODULE SPO ###############

def dissociateItems(ctx, listName, dissociatedActivities, story):
    """Dissociate activities from a selected story on the sharepoint

    Args:
        listName (str): list to update on the sharepoint (story)
        dissociatedActivities (str): comma separated string of activities to dissociate
        story (str): storyId
    """    
    
    tasks_list = ctx.web.lists.get_by_title(listName)

    items = (tasks_list
        .items.get()
        .filter(f"ssapId eq '{story}'")
        .execute_query()
    )

    logger.debug(items)

    item_to_update = items[0]
    childActivities = item_to_update.properties.get('childActivities')

    if childActivities:
        childActivities = childActivities.split(",")
        logger.debug(f"Old child activities: ", childActivities)
        
        for activity in dissociatedActivities:
            childActivities.remove(activity)
        logger.debug(f"New child activities: ", childActivities)

        childActivities = ",".join(childActivities)
        logger.debug(f"Pushing to sharepoint: {childActivities}")

        item_to_update.set_property("childActivities", f"{childActivities}").update().execute_query()
        logger.info("Item has been updated.")

    else:
        logger.info("Item has not been updated, childActivities is None.")



############### DEV SPO ###############

def dev():
    """Dissociate activities form story on the sharepoint. Can be then followed by testing of upload files.
    """    

    data = 'activity_SK7_11_4000139802_'
    
    dissociateItems(ctx, list_name, data, "story_guid_manual_testing")



if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()