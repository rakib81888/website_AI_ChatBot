# config.py
import os
from dotenv import load_dotenv
from pydantic import BaseSettings, AnyUrl, PostgresDsn

load_dotenv()

class Settings(BaseSettings):
    # Admin credentials
    ADMIN_USERNAME: str = "rakib"
    ADMIN_PASSWORD: str = "rakibmim2223"
    
    # Database configuration
    DATABASE_URL: PostgresDsn = "postgresql://user:password@localhost/dbname"
    VECTOR_DB_URL: str = "http://localhost:8000"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o"
    
    # JWT Configuration
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # App Settings
    APP_ENV: str = "development"
    CORS_ORIGINS: list = ["*"]
    
    # n8n Integration
    N8N_WEBHOOK_URL: str = "https://your-n8n-instance.com/webhook"
    
    class Config:
        env_file = ".env"

settings = Settings()