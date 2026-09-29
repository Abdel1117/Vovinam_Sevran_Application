from uuid import UUID

from pydantic import BaseModel


class EnseignantPublic(BaseModel):
    id: UUID
    nom: str
    grade: str
    role: str
    texte: str | None
    photo: str | None
    ordre: int
