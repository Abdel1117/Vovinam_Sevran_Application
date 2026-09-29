from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class Bloc(BaseModel):
    type: Literal["p", "h2", "quote"]
    texte: str


class ArticlePublic(BaseModel):
    id: UUID
    slug: str
    titre: str
    categorie: str
    chapo: str
    corps: list[Bloc]
    tags: list[str]
    image: str
    vignette: str
    facebook_url: str | None
    instagram_url: str | None
    youtube_url: str | None
    auteur: str
    date: datetime
    lecture: str
