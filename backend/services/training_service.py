# training_service.py
import os
import requests
from bs4 import BeautifulSoup
from langchain.document_loaders import WebBaseLoader, PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from ..database import crud, get_db
from ..utils import logging
from ..config import settings
from .openai_integration import generate_embedding
import uuid
import re

# Configure text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

def train_from_website(url: str, client_id: int):
    """Train AI using website content"""
    logging.info(f"Starting website training for client {client_id}: {url}")
    
    try:
        # Load and split website content
        loader = WebBaseLoader(url)
        data = loader.load()
        documents = text_splitter.split_documents(data)
        
        # Create embeddings and store in vector DB
        embeddings = OpenAIEmbeddings()
        store = Chroma.from_documents(
            documents, 
            embeddings, 
            collection_name=f"client_{client_id}",
            persist_directory=f"./data/chroma_{client_id}"
        )
        
        logging.info(f"Website training complete: {len(documents)} chunks")
        return True
    except Exception as e:
        logging.error(f"Website training failed: {str(e)}")
        return False

def train_from_file(file_path: str, client_id: int, file_type: str):
    """Train AI using uploaded file"""
    logging.info(f"Starting file training for client {client_id}: {file_path}")
    
    try:
        # Load appropriate file type
        if file_type == "pdf":
            loader = PyPDFLoader(file_path)
        else:  # Default to text
            loader = TextLoader(file_path)
        
        data = loader.load()
        documents = text_splitter.split_documents(data)
        
        # Create embeddings and store in vector DB
        embeddings = OpenAIEmbeddings()
        store = Chroma.from_documents(
            documents, 
            embeddings, 
            collection_name=f"client_{client_id}",
            persist_directory=f"./data/chroma_{client_id}"
        )
        
        logging.info(f"File training complete: {len(documents)} chunks")
        return True
    except Exception as e:
        logging.error(f"File training failed: {str(e)}")
        return False

def train_from_manual(qa_pairs: list, client_id: int):
    """Train AI using manual Q&A pairs"""
    logging.info(f"Starting manual training for client {client_id}: {len(qa_pairs)} pairs")
    
    try:
        documents = []
        for pair in qa_pairs:
            # Create document with metadata
            doc = {
                "page_content": f"Q: {pair['question']}\nA: {pair['answer']}",
                "metadata": {"source": "manual", "type": "qa"}
            }
            documents.append(doc)
        
        # Create embeddings and store in vector DB
        embeddings = OpenAIEmbeddings()
        store = Chroma.from_documents(
            documents, 
            embeddings, 
            collection_name=f"client_{client_id}",
            persist_directory=f"./data/chroma_{client_id}"
        )
        
        logging.info("Manual training complete")
        return True
    except Exception as e:
        logging.error(f"Manual training failed: {str(e)}")
        return False

def process_training_queue():
    """Process training tasks from queue"""
    db = next(get_db())
    pending_tasks = crud.get_pending_training_tasks(db)
    
    for task in pending_tasks:
        crud.update_training_source_status(db, task.id, "processing")
        
        try:
            success = False
            if task.source_type == "website":
                success = train_from_website(task.source_data["url"], task.client_id)
            elif task.source_type == "file":
                success = train_from_file(
                    task.source_data["path"], 
                    task.client_id,
                    task.source_data.get("type", "text")
                )
            elif task.source_type == "manual":
                success = train_from_manual(task.source_data["qa_pairs"], task.client_id)
            
            status = "completed" if success else "failed"
            crud.update_training_source_status(db, task.id, status)
        except Exception as e:
            logging.error(f"Training task failed: {str(e)}")
            crud.update_training_source_status(db, task.id, "failed")