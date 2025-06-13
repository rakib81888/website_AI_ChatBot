from .web_loader import WebLoader
from .file_processor import FileProcessor
from .qa_generator import QAGenerator
from services.vector_db import VectorDB
import logging

class TrainingManager:
    def __init__(self, client_id):
        self.client_id = client_id
        self.vector_db = VectorDB(client_id)
        self.qa_generator = QAGenerator(client_id)

    def train_from_website(self, url):
        loader = WebLoader(url)
        documents = loader.load()
        self.vector_db.store_documents(documents)
        logging.info(f"Website training completed: {len(documents)} chunks")

    def train_from_file(self, file_path, file_type):
        documents = FileProcessor.process_file(file_path, file_type)
        self.vector_db.store_documents(documents)
        logging.info(f"File training completed: {len(documents)} chunks")

    def train_from_manual_qa(self, qa_pairs):
        documents = []
        for pair in qa_pairs:
            documents.append(f"Q: {pair['question']}\nA: {pair['answer']}")
        self.vector_db.store_documents(documents)
        logging.info(f"Manual QA training completed: {len(qa_pairs)} pairs")

    def auto_generate_qa(self, text, num_questions=10):
        qa_pairs = self.qa_generator.generate_qa_pairs(text, num_questions)
        self.train_from_manual_qa(qa_pairs)
        return qa_pairs