# client.py
# backend/routes/admin.py এবং backend/routes/client.py
from backend.database.models import Client, ChatSession, TrainingSource
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import crud, get_db
from ..utils import security
from ..schemas import client_schemas
import uuid

router = APIRouter(
    prefix="/client",
    tags=["Client"],
    dependencies=[Depends(security.verify_jwt_token)]
)

@router.get("/dashboard", response_model=client_schemas.ClientDashboard)
def get_client_dashboard(db: Session = Depends(get_db), 
                         current_user: dict = Depends(security.verify_jwt_token)):
    """Get client dashboard data"""
    client_id = current_user.get("client_id")
    if not client_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    client = crud.get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Get statistics
    training_sources = crud.get_client_training_sources(db, client_id)
    active_sessions = db.query(ChatSession).filter(
        ChatSession.client_id == client_id,
        ChatSession.last_activity > datetime.utcnow() - timedelta(minutes=30)
    ).count()
    
    return {
        "client": client,
        "training_sources": training_sources,
        "active_sessions": active_sessions,
        "total_sessions": len(client.chat_sessions)
    }

@router.post("/training", response_model=client_schemas.TrainingSource)
def create_training_source(
    source: client_schemas.TrainingSourceCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.verify_jwt_token)
):
    """Create a new training source"""
    client_id = current_user.get("client_id")
    if not client_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return crud.create_training_source(
        db,
        client_id=client_id,
        source_type=source.source_type,
        source_data=source.source_data
    )

@router.get("/training", response_model=list[client_schemas.TrainingSource])
def list_training_sources(
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.verify_jwt_token)
):
    """List client's training sources"""
    client_id = current_user.get("client_id")
    return crud.get_client_training_sources(db, client_id)

@router.put("/config", response_model=client_schemas.ClientConfig)
def update_client_config(
    config: client_schemas.ClientConfigUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.verify_jwt_token)
):
    """Update client configuration"""
    client_id = current_user.get("client_id")
    client = crud.get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Update configurable fields
    if config.persona:
        client.persona = config.persona
    if config.primary_color:
        client.primary_color = config.primary_color
    if config.fallback_email:
        client.fallback_email = config.fallback_email
    
    db.commit()
    db.refresh(client)
    return client

@router.get("/embed-code", response_model=client_schemas.EmbedCode)
def get_embed_code(
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.verify_jwt_token)
):
    """Get embed code for client's website"""
    client_id = current_user.get("client_id")
    client = crud.get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Generate unique signature for this client
    signature = security.generate_hmac_signature(str(client_id), client.domain)
    
    return {
        "code": f"""
        <div id="chatbot-widget"></div>
        <script src="https://yourdomain.com/widget.js?client_id={client_id}&domain={client.domain}&signature={signature}"></script>
        """,
        "instructions": "Copy and paste this code into your website's HTML"
    }