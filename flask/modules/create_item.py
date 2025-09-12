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



############### MODULE SPO ###############

def postItem(ctx, data, listName, storyName, storyId, storyAuthor, storyBirth):
    """Creates a story on the sharepoint

    Args:
        data (str): comma separated ssapIds of child activities
        listName (str): list to update (story)
        storyName (str): Name of the new story
        storyId (str): Unique guid storyId associated to the story
        storyAuthor (str): Creator of the story e-mail address
    """    
    
    tasks_list = ctx.web.lists.get_by_title(listName)

    counter = data.count('activity')

    item = tasks_list.add_item(
        {
            "Title": storyName,
            "childActivities": data,
            "ssapId": storyId, # ssapId
            'storyAuthor': storyAuthor,
            'status': storyBirth,
            'numberOfActivities': str(counter),
            'lastModifiedOn': storyBirth,
            'lastAuthor': storyAuthor, 
            "esaInternal": str(True),
        }
    ).execute_query()
    
    logger.info(f"[MAIN] - Item has been created {data} was posted to {listName}.")



############### DEV SPO ###############

def dev(storyId="story_guid_manual_testing", storyName="Manual backend testing story"):
    """Creates a story on the sharepoint. Can be then followed by testing of associate activities function.

    Args:
        storyId (str, optional): Story Id. Defaults to "story_guid_manual_testing".
        storyName (str, optional): Story Name. Defaults to "Manual backend testing story".
    """   

    data = 'activity_SKR1_05_4000142600_,activity_SK7_11_4000139802_'
    postItem(ctx, data, list_name, storyName, storyId)
    



if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()