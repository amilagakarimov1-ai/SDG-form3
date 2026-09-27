from sqlalchemy import create_engine, TypeDecorator, CHAR
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.types import String
from .config import settings
import uuid


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses CHAR(36) storage, works with both PostgreSQL and SQLite."""
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            if isinstance(value, uuid.UUID):
                return str(value)
            return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return str(value)
        return value


engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
