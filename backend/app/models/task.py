from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Enum
import uuid
import datetime
import enum
from ..database import Base, GUID
from .report import ReportTypeEnum

class PriorityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TaskStatusEnum(str, enum.Enum):
    open = "open"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    report_id = Column(GUID(), ForeignKey("reports.id"), nullable=True)
    assigned_to = Column(GUID(), ForeignKey("users.id"), nullable=True)
    created_by = Column(GUID(), ForeignKey("users.id"), nullable=True)
    municipality_id = Column(GUID(), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    task_type = Column(Enum(ReportTypeEnum), nullable=False)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.medium)
    status = Column(Enum(TaskStatusEnum), default=TaskStatusEnum.open)
    before_photo_url = Column(String, nullable=True)
    after_photo_url = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    due_date = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
