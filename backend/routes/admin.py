# admin.py
# backend/routes/admin.py এবং backend/routes/client.py
from backend.database.models import Client, ChatSession, TrainingSource

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import crud, get_db
from ..utils import security
from ..schemas import admin_schemas

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(security.verify_jwt_token)]
)

@router.post("/clients", response_model=admin_schemas.Client)
def create_client(client: admin_schemas.ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    # Check if username or domain already exists
    existing_client = crud.get_client_by_username(db, username=client.username)
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    existing_domain = crud.get_client_by_domain(db, domain=client.domain)
    if existing_domain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Domain already registered"
        )
    
    return crud.create_client(
        db,
        name=client.name,
        domain=client.domain,
        username=client.username,
        password=client.password
    )

@router.get("/clients", response_model=list[admin_schemas.Client])
def list_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all clients"""
    return db.query(Client).offset(skip).limit(limit).all()

@router.get("/clients/{client_id}", response_model=admin_schemas.ClientDetail)
def get_client_details(client_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a client"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Get client statistics
    training_sources = crud.get_client_training_sources(db, client_id=client_id)
    chat_sessions = db.query(ChatSession).filter(
        ChatSession.client_id == client_id
    ).count()
    
    return {
        "client": client,
        "training_sources": training_sources,
        "chat_sessions_count": chat_sessions,
        "active": client.is_active
    }

@router.put("/clients/{client_id}/status")
def update_client_status(client_id: int, status: bool, db: Session = Depends(get_db)):
    """Activate/deactivate a client"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client.is_active = status
    db.commit()
    return {"status": "success", "is_active": status}

@router.get("/training-sources")
def list_training_sources(status: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all training sources with optional status filter"""
    query = db.query(TrainingSource)
    if status:
        query = query.filter(TrainingSource.status == status)
    return query.offset(skip).limit(limit).all()