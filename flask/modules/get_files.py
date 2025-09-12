"""
Gabriel Gostiaux
2025/04/10

Python module to get files within a folder given the site relative path
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging


# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

def getFiles(ctx, folderPath):
    """Returns a list of files for the specified folder

    Args:
        folderPath (string): folder path to list files from

    Returns:
        dict: file_number - file name
    """

    folder = ctx.web.get_folder_by_server_relative_path(folderPath)
    ctx.load(folder, ["Files"])
    ctx.execute_query()

    # for file in folder.files:
    #     logger.debug(file.name)
    output = {}

    for count, file in enumerate(folder.files):
        output[f"file_{count}"] = file.name
    
    logger.debug(f"List of files located at {folderPath} : \n")
    logger.debug(output)

    return output


############### DEV SPO ###############

def dev():
    """Test returning files from the manual story testing. Runs after upload file testing.
    """
    
    folder = 'Shared Documents/SSAP/story_guid_manual_testing'
    getFiles(ctx, folder)


if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()