from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class ClientBase(BaseModel):
    name: str
    domain: str
    username: str

class ClientCreate(ClientBase):
    password: str

class Client(ClientBase):
    id: int
    api_key: str
    created_at: datetime
    is_active: bool

    class Config:
        orm_mode = True

class ClientDetail(Client):
    training_sources: List[dict]
    chat_sessions_count: int

class TrainingSource(BaseModel):
    id: int
    client_id: int
    source_type: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class TrainingSourceCreate(BaseModel):
    client_id: int
    source_type: str
    source_data: dict

class ChatSessionStats(BaseModel):
    client_id: int
    session_count: int
    last_7_days: int

class SystemStats(BaseModel):
    total_clients: int
    active_clients: int
    pending_training: int
    daily_chats: int