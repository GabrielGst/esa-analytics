"""
Gabriel Gostiaux
2025/04/10

Python module returning a folder from a given site relative path, and will create it if it does not exist. Then upload a file to it.
"""

import os
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging


# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

def createFolder(ctx, folder_path):
    """Creates a folder on the Sharepoint

    Args:
        ctx (function): methodable object to call REST API functions upon
        folder_path (string): Path where to create the new folder, named after slug argument

    Returns:
        object: REST API object folder to use in upload functions
    """    

    folder = (ctx.web.ensure_folder_path(folder_path)
    .get()
    .select(["ServerRelativePath"])
    .execute_query()
    )

    logger.info(f"Folder located : {folder.server_relative_path}")

    return folder

def uploadSmall(filePath, folderPath):
    """Upload files under the threshold MAX_UPLOAD_SIZE

    Args:
        filePath (str): folderPath from form file
        folderPath (object): REST API object folder from createFolder
    """    

    file = folderPath.files.upload(filePath).execute_query()
    
    logger.debug(f"Small file has been uploaded into: {file.serverRelativeUrl}")

# def print_upload_progress(offset, local_path):
#     """Show upload progress

#     Args:
#         offset (number): bytes uploaded
#         local_path (str): local file path
#     """

#     file_size = os.path.getsize(local_path)
    
#     logger.info(f"Uploaded '{offset}' bytes from '{file_size}'...[{round(offset / file_size * 100, 2)}%]")

def uploadLarge(filePath, folder_url, size_chunk = 1000000):
    """Upload files above MAX_UPLOAD_SIZE threshold

    Args:
        filePath (str): folderPth from form file
        folder_url (object): REST API object folder from createFolder
        size_chunk (int, optional): Sizes of the file sampling. Defaults to 1000000.
    """ 

    size_chunk = 1000000

    uploaded_file = folder_url.files.create_upload_session(
        filePath, size_chunk, # print_upload_progress(offset, local_path=filePath) # Need to figure out where getting offset value
    ).execute_query()

    logger.info(f"File {uploaded_file.serverRelativeUrl} has been uploaded successfully")



############### MODULE SPO ###############

MAX_UPLOAD_SIZE = 1024 * 1024 * 4; # 4MB

def uploadFile(ctx, fileData, slug):
    """Uploads a file to a Sharepoint folder

    Args:
        fileData (dict): size, path, name, filtering
        slug (string): activity / story folder
    """    

    fileSize = fileData["size"]
    filePath = fileData["path"]
    fileName = fileData["name"]
    filtering = fileData["filtering"]

    # if filtering == "activity":
    #     basePath = "Shared%20Documents/SSAP/activities"
    # elif filtering == "story":
    #     basePath = "Shared%20Documents/SSAP/stories"
    # else:
    #     basePath = "Shared%20Documents/SSAP"
        
    # folderPath = basePath + f"/{slug}"
    # logger.debug(f"Destination folder {folderPath}")

    # folder = createFolder(ctx, folderPath)

    # logger.debug(f"File size: {fileSize}")

    # if fileSize <= MAX_UPLOAD_SIZE:

    #     uploadSmall(filePath, folder)
    #     logger.info(f"File {fileName} was uploaded to {folderPath} with Small upload.")

    # else:
    #     uploadLarge(filePath, folder)
    #     logger.info(f"File {fileName} was uploaded to {folderPath} with Large upload.")

    # os.remove(filePath)
    logger.debug("tmp folder has been cleared.")



############### DEV SPO ###############

def dev():
    """Upload files to the selected story on the sharepoint. Can then be followed by testing the delete_item function.
    """    

    # filePath = ... # This needs to be thought of, what form should take the file to test the uploading method ?

    # uploadFile(filePath, "story_guid_manual_testing")


if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()