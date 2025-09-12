"""
Gabriel Gostiaux
2025/05/30

Python module defining a SharePoint list delete function (delete a List Item from a List) that works with the Office365 REST Python API.
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging


# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

def deleteItems(ctx, listName, deletedStories):
    """Deletes stories from the Sharepoint

    Args:
        listName (string): list name to delete elements (stories) from 
        deletedStories (list): list of string, ssapIds of stories to delete
    """
    
    tasks_list = ctx.web.lists.get_by_title(listName)

    for story in deletedStories:
        items = (tasks_list
            .items.get()
            .filter(f"ssapId eq '{story}'")
            .execute_query()
        )

        logger.info("Option 1: remove a list item (with an option to restore from a recycle bin)...")
        items[0].recycle().execute_query()

    # print("Option 2: Permanently remove a list item...")
    # items[1].delete_object().execute_query()


############### DEV SPO ###############

import modules.create_item as ci

def dev():
    """Tests deleting stories.
    """    

    ci.dev('story_guid_manual_test_of_delete_story_2', 'manual_test_of_delete_story_2')

    deleteItems(ctx, list_name, ['story_guid_manual_testing', 'story_guid_manual_test_of_delete_story_2'])


if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()