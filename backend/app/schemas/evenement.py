from datetime import date
from uuid import UUID

from pydantic import BaseModel

from app.models.evenement import TypeEvenement


class EvenementSaisie(BaseModel):
    """Corps JSON envoyé par le dashboard ; dates/heures en texte ISO, validées par le service."""

    titre: str
    type: str
    date_debut: str
    date_fin: str | None = None
    heure_debut: str
    heure_fin: str | None = None
    lieu: str
    adresse: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    description: str | None = None


class EvenementPublic(BaseModel):
    id: UUID
    titre: str
    type: TypeEvenement
    date_debut: date
    date_fin: date | None
    heure_debut: str
    heure_fin: str | None
    lieu: str | None
    adresse: str | None
    latitude: float | None
    longitude: float | None
    description: str | None
