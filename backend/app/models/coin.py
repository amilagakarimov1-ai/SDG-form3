from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
import uuid
import datetime
import enum
from ..database import Base, GUID

class TransactionTypeEnum(str, enum.Enum):
    earned_report = "earned_report"
    earned_task = "earned_task"
    spent_ev_charge = "spent_ev_charge"
    spent_partner = "spent_partner"
    bonus_event = "bonus_event"
    admin_grant = "admin_grant"

class GreenCoin(Base):
    __tablename__ = "coins"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    transaction_type = Column(Enum(TransactionTypeEnum), nullable=False)
    reference_id = Column(GUID(), nullable=True)
    description = Column(String, nullable=True)
    qr_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
