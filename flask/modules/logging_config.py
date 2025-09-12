"""
Gabriel Gostiaux
2025/07/3

Python module setting  up the logger object for logging backend events.
"""

import logging
import os

def setup_logging(log_file='logs/logs.log', console_level=logging.INFO, file_level=logging.DEBUG):
    """Sets up the backend logging.

    Args:
        log_file (str, optional): Define the log file to log into. Defaults to 'logs/logs.log'.
        console_level (command, optional): Level of logging. From INFO, DEBUG, WARNING, ..., ERROR. Defaults to logging.INFO.
        file_level (command, optional): Level of logging. From INFO, DEBUG, WARNING, ..., ERROR. Defaults to logging.DEBUG.

    Returns:
        object: logging object to call methods onto.
    """    
    # Root logger
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logging.getLogger("urllib3.connectionpool").setLevel(logging.WARNING)

    # Prevent duplicate handlers
    if logger.handlers:
        return

    # Create a formatter to define the log format
    formatter = logging.Formatter('%(asctime)s - %(name)s → %(levelname)s: %(message)s')

    # File handler
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    fh = logging.FileHandler(log_file)
    fh.setLevel(file_level)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    # Console handler
    ch = logging.StreamHandler()
    ch.setLevel(console_level)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    logger.info("\n\n\nLogging initialized.")

    return logger
