# main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .routes import auth, admin, client, chat
from .config import settings
from .services import training_service
import threading
import time

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Custom AI Chatbot API",
    description="SaaS Platform for Custom Website Chatbots",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(client.router)
app.include_router(chat.router)

# Background training task
def training_background_task():
    """Background task to process training queue"""
    while True:
        try:
            training_service.process_training_queue()
        except Exception as e:
            print(f"Training task error: {str(e)}")
        time.sleep(60)  # Run every minute

@app.on_event("startup")
def startup_event():
    """Start background services on startup"""
    # Start training processor in background thread
    training_thread = threading.Thread(target=training_background_task, daemon=True)
    training_thread.start()
    print("Training processor started")

@app.get("/")
def read_root():
    return {"message": "Custom AI Chatbot API - Operational"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check database connection
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000