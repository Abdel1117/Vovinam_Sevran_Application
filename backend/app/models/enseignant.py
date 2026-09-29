import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


class Enseignant(SQLModel, table=True):
    __tablename__ = "enseignants"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nom: str = Field(nullable=False)
    grade: str = Field(nullable=False)
    role: str = Field(nullable=False)
    texte: str | None = Field(default=None)
    chemin_photo: str | None = Field(default=None)
    ordre: int = Field(default=0, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
