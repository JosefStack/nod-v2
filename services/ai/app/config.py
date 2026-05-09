from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    VOYAGE_API_KEY: str
    PORT: int

    class Config:
        env_file = ".env"

settings = Settings()