# models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    domain = Column(String(255), unique=True, nullable=False)
    api_key = Column(String(64), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Authentication
    username = Column(String(50), unique=True)
    password = Column(String(100))  # Hashed password
    
    # Chatbot Configuration
    persona = Column(String(20), default="friendly")
    primary_color = Column(String(7), default="#3B82F6")
    fallback_email = Column(String(255))
    
    # Relationships
    training_sources = relationship("TrainingSource", back_populates="client")
    chat_sessions = relationship("ChatSession", back_populates="client")

class TrainingSource(Base):
    __tablename__ = "training_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    source_type = Column(String(20))  # 'website', 'pdf', 'manual', 'sheet'
    source_data = Column(JSON)  # {url: ..., pages: ...} or {file_path: ...}
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    client = relationship("Client", back_populates="training_sources")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    session_id = Column(String(36), unique=True)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_activity = Column(DateTime)
    context = Column(JSON)  # Stored conversation context
    
    client = relationship("Client", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    message = Column(String(1000))
    is_bot = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    requires_followup = Column(Boolean, default=False)
    
    session = relationship("ChatSession", back_populates="messages")