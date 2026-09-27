from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.bin import BinStatusEnum

class BinCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    municipality_id: Optional[UUID] = None

class BinUpdate(BaseModel):
    status: Optional[BinStatusEnum] = None
    last_emptied_at: Optional[datetime] = None

class BinResponse(BaseModel):
    id: UUID
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    municipality_id: Optional[UUID] = None
    status: BinStatusEnum
    last_reported_at: Optional[datetime] = None
    last_emptied_at: Optional[datetime] = None
    created_at: datetime
    color_code: str

    class Config:
        from_attributes = True

class BinMapResponse(BaseModel):
    id: UUID
    latitude: float
    longitude: float
    status: BinStatusEnum
    color_code: str
    name: str

    class Config:
        from_attributes = True
