from sqlalchemy import Column, String, Float, DateTime, Enum
import uuid
import datetime
import enum
from ..database import Base, GUID

class BinStatusEnum(str, enum.Enum):
    empty = "empty"
    half_full = "half_full"
    full = "full"
    overflowing = "overflowing"

class TrashBin(Base):
    __tablename__ = "bins"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    municipality_id = Column(GUID(), nullable=True)
    status = Column(Enum(BinStatusEnum), default=BinStatusEnum.empty)
    last_reported_at = Column(DateTime, nullable=True)
    last_emptied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
