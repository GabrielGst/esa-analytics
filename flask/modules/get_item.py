"""
Gabriel Gostiaux
2025/04/10

This common way of retrieving List Items from a List, only the default properties are getting returned

Official documentation:
https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest#working-with-list-items-by-using-rest
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging
from .utils import activityWhiteFilter, storyWhiteFilter

# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

def getItem(ctx, listName, slug):
    """Get one's item data (one item only).

    Args:
        listName (string): Sharepoint List Name
        slug (string): Sharepoint element to get ssapId

    Returns:
        dict: {ssapId: dict}
    """    

    spoList = ctx.web.lists.get_by_title(listName)

    # Create a mapping between InternalNames and Title (should be the same as DisplayName which is inside the SchemaXml attribute)
    mapping = dict()
    output = dict()

    whiteList = activityWhiteFilter + storyWhiteFilter

    result = (
        spoList
        .items.get()
        .filter(f"ssapId eq '{slug}'")
        .execute_query()
    )
    
    item = result[0].properties
    temp_item = dict()

    for f in item.keys():
        mapping[f] = [f]

        if f in whiteList:
            temp_item[f] = item[f]

    output[temp_item['ssapId']] = temp_item

    logger.debug(mapping)
    logger.debug(output)

    return output




############### DEV SPO ###############

def dev():
    """Test getting items data from the Sharepoint.
    """

    getItem(ctx, list_name, 'story_guid_manual_testing')


if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()