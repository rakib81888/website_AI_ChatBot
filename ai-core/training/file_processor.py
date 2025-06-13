# file_processor.py
import PyPDF2
import docx
import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter

class FileProcessor:
    @staticmethod
    def process_file(file_path, file_type):
        try:
            if file_type == 'pdf':
                return FileProcessor._process_pdf(file_path)
            elif file_type == 'docx':
                return FileProcessor._process_docx(file_path)
            elif file_type == 'txt':
                return FileProcessor._process_text(file_path)
            else:
                logging.error(f"Unsupported file type: {file_type}")
                return []
        except Exception as e:
            logging.error(f"File processing error: {str(e)}")
            return []

    @staticmethod
    def _process_pdf(file_path):
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return FileProcessor._chunk_text(text)

    @staticmethod
    def _process_docx(file_path):
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return FileProcessor._chunk_text(text)

    @staticmethod
    def _process_text(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        return FileProcessor._chunk_text(text)

    @staticmethod
    def _chunk_text(text, chunk_size=1000, chunk_overlap=200):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        return splitter.split_text(text)