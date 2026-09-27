from sqlalchemy import Column, String, Boolean, Enum, DateTime
import uuid
import datetime
import enum
from ..database import Base, GUID

class RoleEnum(str, enum.Enum):
    citizen = "citizen"
    municipality_admin = "municipality_admin"
    municipality_worker = "municipality_worker"
    superadmin = "superadmin"

class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.citizen, nullable=False)
    municipality_id = Column(GUID(), nullable=True)
    district = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    fcm_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
