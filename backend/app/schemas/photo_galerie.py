from uuid import UUID

from pydantic import BaseModel


class PhotoGaleriePublic(BaseModel):
    id: UUID
    titre: str
    categorie: str
    date: str
    url: str
    vignette: str
