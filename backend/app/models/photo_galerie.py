import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


class PhotoGalerie(SQLModel, table=True):
    __tablename__ = "photos_galerie"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    titre: str = Field(nullable=False)
    categorie: str = Field(nullable=False)
    date_legende: str = Field(nullable=False)
    chemin_fichier: str = Field(nullable=False)
    chemin_vignette: str | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
