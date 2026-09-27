from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Enum
import uuid
import datetime
import enum
from ..database import Base, GUID

class PartnerTypeEnum(str, enum.Enum):
    ev_charger = "ev_charger"
    retail = "retail"
    restaurant = "restaurant"
    transport = "transport"

class Partner(Base):
    __tablename__ = "partners"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    partner_type = Column(Enum(PartnerTypeEnum), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    discount_percent = Column(Integer, default=0)
    coins_per_unit = Column(Integer, default=1)
    qr_secret = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
