# security.py
import hashlib
import hmac
import os
from jose import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from backend.config import settings

def hash_password(password: str) -> str:
    """Simple password hashing (use bcrypt in production)"""
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return salt + key

def verify_password(stored_password: bytes, provided_password: str) -> bool:
    """Verify a password against stored hash"""
    salt = stored_password[:32]
    stored_key = stored_password[32:]
    new_key = hashlib.pbkdf2_hmac(
        'sha256',
        provided_password.encode('utf-8'),
        salt,
        100000
    )
    return hmac.compare_digest(stored_key, new_key)

def create_jwt_token(data: dict, expires_delta: timedelta = None):
    """Create JWT token for authentication"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def verify_jwt_token(token: str):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def generate_hmac_signature(client_id: str, message: str) -> str:
    """Generate HMAC signature for widget authentication"""
    secret = settings.JWT_SECRET.encode()
    return hmac.new(secret, f"{client_id}:{message}".encode(), 'sha256').hexdigest()

def verify_hmac_signature(client_id: str, message: str, signature: str) -> bool:
    """Verify HMAC signature from widget"""
    expected_signature = generate_hmac_signature(client_id, message)
    return hmac.compare_digest(expected_signature, signature)