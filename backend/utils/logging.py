# logging.py
import logging
import sys
from ..config import settings

def setup_logging():
    """Configure logging for the application"""
    log_level = logging.DEBUG if settings.APP_ENV == "development" else logging.INFO
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Root logger
    logger = logging.getLogger()
    logger.setLevel(log_level)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(logging.Formatter(log_format))
    logger.addHandler(console_handler)
    
    # File handler in production
    if settings.APP_ENV == "production":
        file_handler = logging.FileHandler("app.log")
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter(log_format))
        logger.addHandler(file_handler)

# Initialize logging
setup_logging()

def get_logger(name: str):
    return logging.getLogger(name)