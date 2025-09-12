"""
Gabriel Gostiaux
2025/04/10

Python module defining a SharePoint list post function that works with the Office365 REST Python API.
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging

# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

def postListData(ctx, data, listName):
    """Updates a Sharepoint item with the received data from the frontend

    Args:
        ctx (object): REST API base object to securely call the Sharepoint 
        data (dict): Depends on the nature of element to update. Activity / Story, see /src/lib/types.ts
        listName (string): List name to update
    """    

    itemId = data['ssapId']
    
    spoList = ctx.web.lists.get_by_title(listName)

    items = (spoList
        .items.get()
        .filter(f"ssapId eq '{itemId}'")
        .execute_query()
    )

    item_to_update = items[0]

    for key in data.keys():
        item_to_update.set_property(
            f"{key}", f"{data[key]}",
            ).update().execute_query()
    
    logger.info(f"[MAIN] - Item has been updated {data} was posted to {listName}.")



############### DEV SPO ###############

def dev():
    """Test updating element on the Sharepoint.
    """

    data = {
        "ssapId": "story_guid_manual_testing",
        # "Title": "",
        "storyDescription": "Testing the post list data.",
        # "storyAuthor": "",
        # "contractNumber1": "",
        # "contractNumber2": "",
        # "contractNumber3": "",
        # "contractNumber4": "",
        # "contractNumber5": "",
        # "customer1": "",
        # "customer2": "",
        # "customer3": "",
        # "customer4": "",
        # "customer5": "",
        # "impact1": "",
        # "impact2": "",
        # "impact3": "",
        # "esaInternal": "",
    }

    postListData(ctx, list_name, data)



if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()