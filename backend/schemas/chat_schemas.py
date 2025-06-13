from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatStartRequest(BaseModel):
    client_id: str
    domain: str
    signature: str

class ChatMessage(BaseModel):
    client_id: str
    domain: str
    session_id: Optional[str] = None
    text: str
    signature: str

class ChatResponse(BaseModel):
    text: str
    requires_followup: bool

class ChatSession(BaseModel):
    session_id: str
    started_at: datetime

    class Config:
        orm_mode = True

class ChatMessageHistory(BaseModel):
    message: str
    is_bot: bool
    timestamp: datetime

    class Config:
        orm_mode = True