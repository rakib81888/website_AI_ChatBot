# auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import crud, get_db
from ..utils import security
from ..config import settings

router = APIRouter(tags=["Authentication"])

@router.post("/admin/login")
def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Admin login endpoint"""
    if form_data.username != settings.ADMIN_USERNAME or form_data.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_jwt_token(
        data={"sub": form_data.username, "role": "admin"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/client/login")
def client_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Client login endpoint"""
    client = crud.get_client_by_username(db, username=form_data.username)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Password verification (simplified for example)
    # In production: use proper hashing and verification
    if form_data.password != client.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_jwt_token(
        data={"sub": form_data.username, "client_id": client.id, "role": "client"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "client_id": client.id,
        "name": client.name
    }

@router.post("/widget/auth")
def widget_authentication(client_id: str, domain: str, signature: str, db: Session = Depends(get_db)):
    """Authenticate widget requests"""
    client = crud.get_client_by_domain(db, domain=domain)
    if not client or str(client.id) != client_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid client credentials"
        )
    
    if not security.verify_hmac_signature(client_id, domain, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )
    
    # Return minimal token for widget operations
    return {"status": "authenticated", "client_id": client_id}