# chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import crud, get_db
from ..utils import security
from ..services import openai_integration, training_service
from ..schemas import chat_schemas
from datetime import datetime
import uuid

router = APIRouter(tags=["Chat"])

@router.post("/start", response_model=chat_schemas.ChatSession)
def start_chat_session(
    request: chat_schemas.ChatStartRequest,
    db: Session = Depends(get_db)
):
    """Start a new chat session"""
    # Verify client signature
    if not security.verify_hmac_signature(
        request.client_id, 
        request.domain, 
        request.signature
    ):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    client = crud.get_client_by_domain(db, domain=request.domain)
    if not client or str(client.id) != request.client_id:
        raise HTTPException(status_code=404, detail="Client not found")
    
    if not client.is_active:
        raise HTTPException(status_code=403, detail="Client account inactive")
    
    session = crud.create_chat_session(db, client_id=client.id)
    return session

@router.post("/message", response_model=chat_schemas.ChatResponse)
def handle_chat_message(
    message: chat_schemas.ChatMessage,
    db: Session = Depends(get_db)
):
    """Handle incoming chat message"""
    # Verify client signature
    if not security.verify_hmac_signature(
        message.client_id, 
        message.domain, 
        message.signature
    ):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    client = crud.get_client_by_domain(db, domain=message.domain)
    if not client or str(client.id) != message.client_id:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Get or create session
    if not message.session_id:
        session = crud.create_chat_session(db, client_id=client.id)
    else:
        session = crud.get_chat_session(db, message.session_id)
        if not session:
            session = crud.create_chat_session(db, client_id=client.id)
    
    # Add user message to history
    crud.add_chat_message(db, session.id, message.text, is_bot=False)
    
    # Generate bot response
    try:
        response = openai_integration.generate_response(
            message.text,
            client_config={
                "persona": client.persona,
                "primary_color": client.primary_color
            },
            session_id=session.id
        )
        
        # Add bot response to history
        crud.add_chat_message(db, session.id, response.text, is_bot=True)
        
        return response
    except Exception as e:
        # Fallback to human support
        if client.fallback_email:
            # TODO: Implement email notification
            fallback_msg = "I'm having trouble answering that. A human support agent will contact you shortly."
        else:
            fallback_msg = "I'm having trouble answering that. Please try again later."
        
        crud.add_chat_message(db, session.id, fallback_msg, is_bot=True)
        return {"text": fallback_msg, "requires_followup": True}

@router.get("/history", response_model=list[chat_schemas.ChatMessage])
def get_chat_history(
    session_id: str,
    client_id: str,
    domain: str,
    signature: str,
    db: Session = Depends(get_db)
):
    """Get chat history for a session"""
    if not security.verify_hmac_signature(client_id, domain, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    session = crud.get_chat_session_by_uuid(db, session_id)
    if not session:
        return []
    
    return crud.get_chat_history(db, session.id)