from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://relaxia:password@localhost:5432/relaxia_store"
    SECRET_KEY: str = "change-me-to-a-64-char-random-string"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24

    ADMIN_USERNAME: str = "relaxia_admin"
    ADMIN_PASSWORD_HASH: str = "$2b$12$placeholder"

    GOOGLE_SHEETS_WEBHOOK_URL: str = ""

    FACEBOOK_ACCESS_TOKEN: str = ""
    FACEBOOK_PIXEL_ID: str = ""
    FACEBOOK_TEST_EVENT_CODE: str = ""

    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""

    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""

    CORS_ORIGINS: List[str] = ["https://relaxia.store", "https://www.relaxia.store", "http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
