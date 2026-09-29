import re
import uuid
from datetime import date, datetime, timezone

from app.interface.demande_essai_repository import IDemandeEssaiRepository
from app.models.demande_essai import CoursEssai, DemandeEssai, StatutDemande
from app.schemas.demande_essai import DemandeEssaiAdminSaisie, DemandeEssaiPublic, DemandeEssaiPubliqueSaisie
from app.utils.exceptions import DemandeIntrouvableError, DemandeInvalideError

NOM_MAX = 60
EMAIL_MAX = 254
MESSAGE_MAX = 1000
NOTE_MAX = 1000

# Lettres (accents compris), séparées par des espaces, tirets ou apostrophes : « Jean-Pierre », « N'Diaye ».
_REGEX_NOM = re.compile(r"^[^\W\d_]+(?:[ '’\-][^\W\d_]+)*$")
_REGEX_EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
_REGEX_TELEPHONE = re.compile(r"^0\d([\s.-]?\d{2}){4}$")


def _nom(valeur: str, champ: str) -> str:
    valeur = " ".join(valeur.split())
    if not valeur:
        raise DemandeInvalideError(f"Le {champ} est requis.")
    if len(valeur) > NOM_MAX or not _REGEX_NOM.match(valeur):
        raise DemandeInvalideError(f"Le {champ} n'est pas valide.")
    return valeur


def _champs_communs(saisie: DemandeEssaiPubliqueSaisie | DemandeEssaiAdminSaisie) -> dict:
    email = saisie.email.strip().lower()
    if len(email) > EMAIL_MAX or not _REGEX_EMAIL.match(email):
        raise DemandeInvalideError("Adresse email invalide.")

    telephone = (saisie.telephone or "").strip() or None
    if telephone and not _REGEX_TELEPHONE.match(telephone):
        raise DemandeInvalideError("Numéro de téléphone invalide (ex : 06 12 34 56 78).")

    try:
        cours = CoursEssai(saisie.cours)
    except ValueError as exc:
        raise DemandeInvalideError("Choisissez un cours : enfants, adolescents ou adultes.") from exc

    message = (saisie.message or "").strip() or None
    if message and len(message) > MESSAGE_MAX:
        raise DemandeInvalideError(f"Le message ne doit pas dépasser {MESSAGE_MAX} caractères.")

    return {
        "prenom": _nom(saisie.prenom, "prénom"),
        "nom": _nom(saisie.nom, "nom"),
        "email": email,
        "telephone": telephone,
        "cours": cours,
        "message": message,
    }


def _champs_suivi(saisie: DemandeEssaiAdminSaisie) -> dict:
    try:
        statut = StatutDemande(saisie.statut)
    except ValueError as exc:
        raise DemandeInvalideError("Statut inconnu.") from exc

    date_essai = None
    if saisie.date_essai:
        try:
            date_essai = date.fromisoformat(saisie.date_essai.strip())
        except ValueError as exc:
            raise DemandeInvalideError("Date d'essai invalide.") from exc
    if statut == StatutDemande.ESSAI_PLANIFIE and date_essai is None:
        raise DemandeInvalideError("Indiquez la date du cours d'essai planifié.")

    note = (saisie.note_interne or "").strip() or None
    if note and len(note) > NOTE_MAX:
        raise DemandeInvalideError(f"La note ne doit pas dépasser {NOTE_MAX} caractères.")

    return {"statut": statut, "date_essai": date_essai, "note_interne": note}


class DemandeEssaiService:
    def __init__(self, demande_repository: IDemandeEssaiRepository) -> None:
        self._demande_repository = demande_repository

    async def list_demandes(self, statut: str | None = None, limit: int | None = None) -> list[DemandeEssaiPublic]:
        try:
            filtre = StatutDemande(statut) if statut else None
        except ValueError as exc:
            raise DemandeInvalideError("Statut inconnu.") from exc
        demandes = await self._demande_repository.list(filtre, limit)
        return [DemandeEssaiPublic.model_validate(d, from_attributes=True) for d in demandes]

    async def get_demande(self, demande_id: uuid.UUID) -> DemandeEssaiPublic | None:
        demande = await self._demande_repository.get(demande_id)
        return DemandeEssaiPublic.model_validate(demande, from_attributes=True) if demande else None

    async def recevoir_demande(self, saisie: DemandeEssaiPubliqueSaisie) -> None:
        """Demande envoyée depuis le site. Ne renvoie rien au visiteur (données personnelles)."""
        if saisie.site_web:
            # Robot détecté : on fait comme si tout allait bien, sans rien enregistrer.
            return
        if not saisie.consentement:
            raise DemandeInvalideError("Vous devez accepter l'utilisation de vos données pour envoyer la demande.")
        await self._demande_repository.create(DemandeEssai(**_champs_communs(saisie)))

    async def create_demande(self, saisie: DemandeEssaiAdminSaisie) -> DemandeEssaiPublic:
        demande = DemandeEssai(**_champs_communs(saisie), **_champs_suivi(saisie))
        demande = await self._demande_repository.create(demande)
        return DemandeEssaiPublic.model_validate(demande, from_attributes=True)

    async def update_demande(self, demande_id: uuid.UUID, saisie: DemandeEssaiAdminSaisie) -> DemandeEssaiPublic:
        demande = await self._get_ou_erreur(demande_id)
        for champ, valeur in {**_champs_communs(saisie), **_champs_suivi(saisie)}.items():
            setattr(demande, champ, valeur)
        demande.updated_at = datetime.now(timezone.utc)
        demande = await self._demande_repository.update(demande)
        return DemandeEssaiPublic.model_validate(demande, from_attributes=True)

    async def delete_demande(self, demande_id: uuid.UUID) -> None:
        await self._demande_repository.delete(await self._get_ou_erreur(demande_id))

    async def _get_ou_erreur(self, demande_id: uuid.UUID) -> DemandeEssai:
        demande = await self._demande_repository.get(demande_id)
        if demande is None:
            raise DemandeIntrouvableError("Demande introuvable.")
        return demande
