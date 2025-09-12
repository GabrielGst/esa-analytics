"""
Gabriel Gostiaux
2025/04/10

Python module defining a SharePoint list get function that works with the Office365 REST Python API.
"""

import os
import csv
import logging
from dotenv import load_dotenv

from .utils import authenticate
from .logging_config import setup_logging
from .utils import activityWhiteFilter, storyWhiteFilter

# Create a logger object
logger = logging.getLogger(__name__)



############### FUNCTIONS SPO ###############

whiteList = activityWhiteFilter + storyWhiteFilter

def exportCSV(path, items, export):
    """Exports mapping and Sharepoint rows from a list to a .csv file.

    Args:
        path (dtr): Location of the export files
        items (object): REST API object containing the fetched rows
        export (bool): Default to False, thus exporting only the mapping. Set to True for exporting the rows as well.

    Returns:
        dict: {item_i: sharepoint row}
    """
    
    # Create a mapping between InternalNames and Title (should be the same as DisplayName which is inside the SchemaXml attribute)
    mapping = dict()
    output = dict()

    if export:

        for i, item in enumerate(items):
            item = item.properties
            temp_item = dict()

            for f in item.keys():
                mapping[f] = [f]
                
                if f in whiteList:
                    temp_item[f] = item[f]

                    ## in case the sharepoint list headers are not named after their display name
                    # if f in mapping.keys():
                    #     temp_item[f]
                    #     temp_item[mapping[f][0]] = item[f]
                    # else:
                    #     temp_item[f] = item[f]

            if i == 0:
                logger.debug(f"item properties (original): {item}")
                logger.debug(f"item properties (mapped): {temp_item}")
                output[f'item_{i}'] = temp_item
            else:
                output[f'item_{i}'] = temp_item

        # Exporting the .csv data
        with open(path + ".csv", "w") as fh:
            writer = csv.DictWriter(file, fieldnames=output.keys())
            
            # Write the header (column names)
            writer.writeheader()
            
            # Write the data (single row)
            writer.writerow(mapping)

    else:

        for i, item in enumerate(items):
            item = item.properties
            temp_item = dict()

            for f in item.keys():
                mapping[f] = [f]

                if f in whiteList:
                    temp_item[f] = item[f]

            if i == 0:
                logger.debug(f"item properties (original): {item}")
                logger.debug(f"item properties (mapped): {temp_item}")
                output[f'item_{i}'] = temp_item
            else:
                output[f'item_{i}'] = temp_item
    

    # Export the mapping as well
    with open(path + "_mapping" + ".csv", mode="w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=mapping.keys())
        
        # Write the header (column names)
        writer.writeheader()
        
        # Write the data (single row)
        writer.writerow(mapping)

    outputList = {k: v for i, (k, v) in enumerate(output.items()) if i < 10} 

    logger.debug(f"Dictionnary of remapped lists' elements {outputList}")
    logger.info(f"List data has been exported into '{path}' file")

    return output


############### MODULE SPO ###############

def getListData(ctx, listName, pathName="flask/data/", export=False):
    """Fetches the complete data from all rows of a Sharepoint list

    Args:
        listName (str): list name to fetch on the Sharepoint
        pathName (str, optional): Location of the exports. Defaults to "flask/data/".
        export (bool, optional): Set to True if you want export of the data. Defaults to False.

    Returns:
        dict: {item_i: sharepoint row}
    """

    SITE_NAME = os.getenv('SITE_NAME')

    large_list = ctx.web.lists.get_by_title(listName)
    
    # Load the fields (columns) of the list
    fields = (
        large_list.fields.get().execute_query()
    )
    
    logger.debug(fields)

    paged_items = (
        large_list.items.paged(100).get().execute_query()
    )

    # logger.debug(paged_items)

    titles = [item.properties["Title"] for c, item in enumerate(paged_items)]
    logger.debug(f"Items number : {len(titles)} {titles[:10]}")
    
    data = exportCSV(pathName + listName, paged_items, export)
    logger.debug(f"[MAIN] - {listName} was stored to {pathName} from {SITE_NAME}.")
    
    return data 


############### DEV SPO ###############

def dev():
    """Test fetching a whole list from the Sharepoint.
    """

    getListData(ctx, list_name, export=True)
    



if __name__ == "__main__":

    load_dotenv()
    
    CLIENT_ID = os.getenv('CLIENT_ID')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    SITE_NAME = os.getenv('SITE_NAME')

    list_name = os.getenv('STORY_NAME')

    logger = setup_logging()
    ctx = authenticate(CLIENT_ID, CLIENT_SECRET, SITE_NAME, logger)

    dev()