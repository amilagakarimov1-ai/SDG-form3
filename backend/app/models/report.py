from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Enum, Integer
import uuid
import datetime
import enum
from ..database import Base, GUID

class ReportTypeEnum(str, enum.Enum):
    full_bin = "full_bin"
    broken_bin = "broken_bin"
    road_damage = "road_damage"
    broken_light = "broken_light"
    illegal_dumping = "illegal_dumping"
    other = "other"

class AIVerdictEnum(str, enum.Enum):
    confirmed = "confirmed"
    rejected = "rejected"
    manual_review = "manual_review"

class ReportStatusEnum(str, enum.Enum):
    pending_ai = "pending_ai"
    confirmed = "confirmed"
    rejected = "rejected"
    task_created = "task_created"

class Report(Base):
    __tablename__ = "reports"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    reporter_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    bin_id = Column(GUID(), ForeignKey("bins.id"), nullable=True)
    report_type = Column(Enum(ReportTypeEnum), nullable=False)
    photo_url = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    ai_verdict = Column(Enum(AIVerdictEnum), nullable=True)
    coins_awarded = Column(Integer, default=0)
    status = Column(Enum(ReportStatusEnum), default=ReportStatusEnum.pending_ai)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
