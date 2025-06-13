from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TrainingSourceCreate(BaseModel):
    source_type: str
    source_data: dict

class TrainingSource(BaseModel):
    id: int
    source_type: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class ClientConfigUpdate(BaseModel):
    persona: Optional[str] = None
    primary_color: Optional[str] = None
    fallback_email: Optional[str] = None

class ClientConfig(BaseModel):
    persona: str
    primary_color: str
    fallback_email: Optional[str]

    class Config:
        orm_mode = True

class EmbedCode(BaseModel):
    code: str
    instructions: str

class ClientDashboard(BaseModel):
    client: dict
    training_sources: List[TrainingSource]
    active_sessions: int
    total_sessions: int