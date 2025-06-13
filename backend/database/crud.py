# crud.py
from sqlalchemy.orm import Session
from .models import Client, TrainingSource, ChatSession, ChatMessage
from datetime import datetime
import uuid

def get_client_by_username(db: Session, username: str):
    return db.query(Client).filter(Client.username == username).first()

def get_client_by_domain(db: Session, domain: str):
    return db.query(Client).filter(Client.domain == domain).first()

def create_client(db: Session, name: str, domain: str, username: str, password: str):
    # Generate API key for client
    api_key = f"chatbot_{str(uuid.uuid4()).replace('-', '')}"
    
    db_client = Client(
        name=name,
        domain=domain,
        username=username,
        password=password,  # Note: Should be hashed in production
        api_key=api_key,
        created_at=datetime.utcnow()
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def create_training_source(db: Session, client_id: int, source_type: str, source_data: dict):
    db_source = TrainingSource(
        client_id=client_id,
        source_type=source_type,
        source_data=source_data,
        status="queued",
        created_at=datetime.utcnow()
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source

def create_chat_session(db: Session, client_id: int):
    session_id = str(uuid.uuid4())
    db_session = ChatSession(
        client_id=client_id,
        session_id=session_id,
        started_at=datetime.utcnow(),
        last_activity=datetime.utcnow()
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def add_chat_message(db: Session, session_id: int, message: str, is_bot: bool):
    db_message = ChatMessage(
        session_id=session_id,
        message=message,
        is_bot=is_bot,
        timestamp=datetime.utcnow()
    )
    db.add(db_message)
    db.commit()
    return db_message

def get_chat_history(db: Session, session_id: int, limit: int = 20):
    return db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(
        ChatMessage.timestamp.desc()
    ).limit(limit).all()

def update_training_source_status(db: Session, source_id: int, status: str):
    source = db.query(TrainingSource).filter(TrainingSource.id == source_id).first()
    if source:
        source.status = status
        db.commit()
        db.refresh(source)
    return source

def get_client_training_sources(db: Session, client_id: int):
    return db.query(TrainingSource).filter(
        TrainingSource.client_id == client_id
    ).order_by(TrainingSource.created_at.desc()).all()