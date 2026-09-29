from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.demande_essai import CoursEssai, StatutDemande


class DemandeEssaiPubliqueSaisie(BaseModel):
    """Envoyée depuis le formulaire de contact du site."""

    prenom: str
    nom: str
    email: str
    telephone: str | None = None
    cours: str
    message: str | None = None
    consentement: bool = False
    # Champ piège invisible pour les humains : s'il est rempli, c'est un robot.
    site_web: str | None = None


class DemandeEssaiAdminSaisie(BaseModel):
    """Création manuelle (appel téléphonique…) ou modification depuis le dashboard."""

    prenom: str
    nom: str
    email: str
    telephone: str | None = None
    cours: str
    message: str | None = None
    statut: str = StatutDemande.A_TRAITER.value
    date_essai: str | None = None
    note_interne: str | None = None


class DemandeEssaiPublic(BaseModel):
    id: UUID
    prenom: str
    nom: str
    email: str
    telephone: str | None
    cours: CoursEssai
    message: str | None
    statut: StatutDemande
    date_essai: date | None
    note_interne: str | None
    created_at: datetime
    updated_at: datetime
