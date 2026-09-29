import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlmodel import Field, Relationship, SQLModel

from app.models.user import User


class Article(SQLModel, table=True):
    __tablename__ = "articles"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    slug: str = Field(unique=True, index=True, nullable=False)
    titre: str = Field(nullable=False)
    categorie: str = Field(nullable=False)
    chapo: str = Field(nullable=False)
    corps: list[dict] = Field(sa_column=Column(JSONB, nullable=False))
    tags: list[str] = Field(default_factory=list, sa_column=Column(ARRAY(String), nullable=False))
    chemin_image: str = Field(nullable=False)
    chemin_vignette: str = Field(nullable=False)
    facebook_url: str | None = Field(default=None)
    instagram_url: str | None = Field(default=None)
    youtube_url: str | None = Field(default=None)
    auteur_id: uuid.UUID | None = Field(
        default=None,
        sa_column=Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    auteur: User | None = Relationship()
