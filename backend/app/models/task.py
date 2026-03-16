import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, String, Text
from sqlalchemy.orm import DeclarativeBase


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class Priority(str, PyEnum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    OPTIONAL = "OPTIONAL"


class Task(Base):
    __tablename__ = "tasks"

    # Identity
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, nullable=False, default=utcnow)
    updated_at = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    # MVP fields
    title = Column(String(255), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    is_complete = Column(Boolean, nullable=False, default=False)
    completed_at = Column(DateTime, nullable=True)

    # Future-ready (nullable; ignored by MVP UI)
    description = Column(Text, nullable=True)
    priority = Column(Enum(Priority, name="priority_enum"), nullable=True)
    scheduled_time = Column(DateTime, nullable=True)
    scheduled_end_time = Column(DateTime, nullable=True)
    due_date = Column(Date, nullable=True)

    # AI agent fields
    ai_notes = Column(Text, nullable=True)
    is_locked = Column(Boolean, nullable=False, default=False)

    # External integrations
    external_source = Column(String(50), nullable=True)
    external_id = Column(String(255), nullable=True)
