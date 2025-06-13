# openai_integration.py
import openai
import os
from ..config import settings
from ..database import crud, get_db
from ..utils import logging
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from datetime import datetime
import re

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY

def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent prompt injection"""
    # Remove special characters that might break the prompt
    sanitized = re.sub(r'[^\w\s.,?\'"-]', '', text)
    return sanitized[:500]  # Limit to 500 characters

def generate_response(query: str, client_config: dict, session_id: int = None):
    """Generate AI response using OpenAI"""
    # Sanitize input
    sanitized_query = sanitize_input(query)
    
    # Get context from vector store if available
    context = ""
    if session_id:
        db = next(get_db())
        try:
            # Get client-specific vector store
            store = Chroma(
                collection_name=f"client_{client_config.get('client_id')}",
                embedding_function=OpenAIEmbeddings()
            )
            
            # Retrieve relevant context
            docs = store.similarity_search(sanitized_query, k=3)
            context = "\n\n".join([doc.page_content for doc in docs])
        except Exception as e:
            logging.error(f"Vector store error: {str(e)}")
            context = ""

    # Create prompt with context and persona
    prompt = PromptTemplate.from_template("""
    [System]
    You are a customer support assistant for {client_name}. 
    Your persona: {persona}
    Current date: {current_date}
    
    [Context]
    {context}
    
    [Conversation History]
    {history}
    
    [User Query]
    {query}
    
    [Response Guidelines]
    - Answer concisely and helpfully
    - If unsure, ask clarifying questions
    - Never invent information
    - Maintain {persona} tone
    """)
    
    # Get conversation history
    history = ""
    if session_id:
        db = next(get_db())
        messages = crud.get_chat_history(db, session_id)
        history = "\n".join([
            f"{'Bot' if msg.is_bot else 'User'}: {msg.message}" 
            for msg in messages[-5:]  # Last 5 messages
        ])
    
    # Format prompt
    formatted_prompt = prompt.format(
        client_name=client_config.get("name", "the business"),
        persona=client_config.get("persona", "friendly"),
        current_date=datetime.now().strftime("%Y-%m-%d"),
        context=context,
        history=history,
        query=sanitized_query
    )
    
    # Call OpenAI API
    try:
        response = openai.ChatCompletion.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful customer support assistant."},
                {"role": "user", "content": formatted_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return {
            "text": response.choices[0].message['content'].strip(),
            "requires_followup": False
        }
    except openai.error.OpenAIError as e:
        logging.error(f"OpenAI API error: {str(e)}")
        raise Exception("Failed to generate response")

def generate_embedding(text: str) -> list:
    """Generate text embedding using OpenAI"""
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']