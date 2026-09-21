import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


class ContactUrgence(SQLModel, table=True):
    __tablename__ = "contacts_urgence"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    adherent_id: uuid.UUID = Field(foreign_key="adherents.id", nullable=False, index=True)
    nom: str = Field(nullable=False)
    telephone: str = Field(nullable=False)
    lien: str | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
