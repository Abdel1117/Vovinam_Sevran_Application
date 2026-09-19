import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class UserRole(str, Enum):
    ADMIN = "admin"
    ADHERENT = "adherent"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    nom: str = Field(nullable=False)
    prenom: str = Field(nullable=False)
    role: UserRole = Field(
        default=UserRole.ADHERENT,
        sa_column=Column(
            SAEnum(UserRole, name="userrole", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    is_active: bool = Field(default=True, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
