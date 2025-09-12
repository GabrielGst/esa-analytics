"""
Gabriel Gostiaux
2025/06/03

Python module defining a SharePoint list update function that works with the Office365 REST Python API.
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging


# Create a logger object
logger = logging.getLogger(__name__)



############### MODULE SPO ###############

def updateActivityAssociate(ctx, associatedActivities, listName, storyId):
    """This function updates a story by associating new activities to it.

    Args:
        associatedActivities (string): activities ID comma separated string
        siteName (string): ENV VAR of the SPO URL
        listName (string): list name to update
        storyId (string): Story ID to update
    """    
    
    tasks_list = ctx.web.lists.get_by_title(listName)

    items = (tasks_list
        .items.get()
        .filter(f"ssapId eq '{storyId}'")
        .execute_query()
    )

    logger.debug(items)

    item_to_update = items[0]

    childActivities = item_to_update.properties.get('childActivities')

    if childActivities:
        childActivities = childActivities.split(",")
        logger.debug(f"Old child activities: ", childActivities)
        
        associatedActivities = associatedActivities.split(",")
        counter = len(childActivities)

        for activity in associatedActivities:
            childActivities.append(activity)
            counter += 1

        logger.debug(f"New child activities: ", childActivities)

        childActivities = ",".join(childActivities)
        logger.debug(f"Pushing to sharepoint: {childActivities}")

        item_to_update.set_property("childActivities", f"{childActivities}").update().execute_query()
        item_to_update.set_property("numberOfActivities", f"{counter}").update().execute_query()
        
        logger.info("Item has been updated.")
    
    else:
        
        logger.debug(f"Old child activities: ", childActivities)
        
        associatedActivities = associatedActivities.split(",")
        childActivities = []

        counter = 0
        
        for activity in associatedActivities:
            childActivities.append(activity)
            counter += 1

        logger.debug(f"New child activities: ", childActivities)

        childActivities = ",".join(childActivities)
        logger.debug(f"Pushing to sharepoint: {childActivities}")

        item_to_update.set_property("childActivities", f"{childActivities}").update().execute_query()
        item_to_update.set_property("numberOfActivities", f"{counter}").update().execute_query()

        logger.info("Item has been updated.")
    
    # logger.info("Item has not been updated, childActivities is None.")



############### DEV SPO ###############

def dev():
    """
    This dev function will update story story_guidlMPuuYicCRAtwhY to add activities activity_SKR1_05_4000142600_ and activity_SK7_11_4000139802_
    """

    data = 'activity_SKR1_05_4000142600_,activity_SK7_11_4000139802_'
    story = 'story_guidlMPuuYicCRAtwhY'

    updateActivityAssociate(ctx, data, SITE_NAME, list_name, story)



if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()