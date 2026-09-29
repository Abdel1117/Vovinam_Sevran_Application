import re
import uuid
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from app.interface.evenement_repository import IEvenementRepository
from app.models.evenement import Evenement, TypeEvenement
from app.schemas.evenement import EvenementPublic, EvenementSaisie
from app.utils.exceptions import EvenementIntrouvableError, EvenementInvalideError

FUSEAU_CLUB = ZoneInfo("Europe/Paris")
TITRE_MIN, TITRE_MAX = 3, 100
LIEU_MIN, LIEU_MAX = 3, 150
DESCRIPTION_MAX = 600
ADRESSE_MAX = 200
DUREE_PAR_DEFAUT = timedelta(hours=2)

_REGEX_HEURE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def aujourd_hui() -> date:
    return datetime.now(FUSEAU_CLUB).date()


@dataclass
class _EvenementValide:
    titre: str
    type_evenement: TypeEvenement
    date_evenement: date
    date_fin: date | None
    heure_debut: time
    heure_fin: time | None
    lieu: str
    adresse: str | None
    latitude: float | None
    longitude: float | None
    description: str | None


def _parse_date(valeur: str, champ: str) -> date:
    try:
        return date.fromisoformat(valeur.strip())
    except ValueError as exc:
        raise EvenementInvalideError(f"{champ} invalide.") from exc


def _parse_heure(valeur: str, champ: str) -> time:
    valeur = valeur.strip()
    if not _REGEX_HEURE.match(valeur):
        raise EvenementInvalideError(f"{champ} invalide (format HH:MM).")
    return time.fromisoformat(valeur)


def _valider(saisie: EvenementSaisie, est_creation: bool) -> _EvenementValide:
    titre = " ".join(saisie.titre.split())
    if not TITRE_MIN <= len(titre) <= TITRE_MAX:
        raise EvenementInvalideError(f"Le titre doit faire entre {TITRE_MIN} et {TITRE_MAX} caractères.")
    if not re.search(r"[^\W\d_]", titre):
        raise EvenementInvalideError("Le titre doit contenir au moins une lettre.")

    try:
        type_evenement = TypeEvenement(saisie.type)
    except ValueError as exc:
        raise EvenementInvalideError("Type d'événement inconnu.") from exc

    date_debut = _parse_date(saisie.date_debut, "Date de début")
    date_fin = _parse_date(saisie.date_fin, "Date de fin") if saisie.date_fin else None
    if date_fin == date_debut:
        date_fin = None
    if date_fin is not None and date_fin < date_debut:
        raise EvenementInvalideError("La date de fin doit être après la date de début.")
    # On peut corriger un événement passé, mais pas en créer un nouveau dans le passé.
    if est_creation and date_debut < aujourd_hui():
        raise EvenementInvalideError("L'événement ne peut pas être dans le passé.")

    heure_debut = _parse_heure(saisie.heure_debut, "Heure de début")
    heure_fin = _parse_heure(saisie.heure_fin, "Heure de fin") if saisie.heure_fin else None
    if heure_fin is not None and date_fin is None and heure_fin <= heure_debut:
        raise EvenementInvalideError("L'heure de fin doit être après l'heure de début.")

    lieu = " ".join(saisie.lieu.split())
    if not LIEU_MIN <= len(lieu) <= LIEU_MAX:
        raise EvenementInvalideError(f"Le lieu doit faire entre {LIEU_MIN} et {LIEU_MAX} caractères.")

    adresse = " ".join((saisie.adresse or "").split()) or None
    latitude, longitude = (saisie.latitude, saisie.longitude) if adresse else (None, None)
    if adresse:
        if len(adresse) > ADRESSE_MAX:
            raise EvenementInvalideError(f"L'adresse ne doit pas dépasser {ADRESSE_MAX} caractères.")
        # Les coordonnées viennent de l'autocomplétion : sans elles, l'adresse n'a pas été choisie dans la liste.
        if latitude is None or longitude is None:
            raise EvenementInvalideError("Choisissez l'adresse dans la liste de suggestions.")
        if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
            raise EvenementInvalideError("Coordonnées de l'adresse invalides.")

    description = (saisie.description or "").strip() or None
    if description and len(description) > DESCRIPTION_MAX:
        raise EvenementInvalideError(f"La description ne doit pas dépasser {DESCRIPTION_MAX} caractères.")

    return _EvenementValide(
        titre=titre,
        type_evenement=type_evenement,
        date_evenement=date_debut,
        date_fin=date_fin,
        heure_debut=heure_debut,
        heure_fin=heure_fin,
        lieu=lieu,
        adresse=adresse,
        latitude=latitude,
        longitude=longitude,
        description=description,
    )


def _echapper_ics(texte: str) -> str:
    return texte.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\r\n", "\\n").replace("\n", "\\n")


def _plier_ligne_ics(ligne: str) -> str:
    """RFC 5545 : lignes de 75 octets max, les suivantes commencent par un espace."""
    morceaux, courant, taille = [], "", 0
    for caractere in ligne:
        octets = len(caractere.encode("utf-8"))
        limite = 75 if not morceaux else 74
        if taille + octets > limite:
            morceaux.append(courant)
            courant, taille = "", 0
        courant += caractere
        taille += octets
    morceaux.append(courant)
    return "\r\n ".join(morceaux)


def _utc_ics(jour: date, heure: time) -> str:
    moment = datetime.combine(jour, heure, tzinfo=FUSEAU_CLUB).astimezone(timezone.utc)
    return moment.strftime("%Y%m%dT%H%M%SZ")


class EvenementService:
    def __init__(self, evenement_repository: IEvenementRepository) -> None:
        self._evenement_repository = evenement_repository

    async def list_a_venir(self, limit: int | None = None) -> list[EvenementPublic]:
        evenements = await self._evenement_repository.list_a_venir(aujourd_hui(), limit)
        return [self._to_public(e) for e in evenements]

    async def list_tous(self) -> list[EvenementPublic]:
        return [self._to_public(e) for e in await self._evenement_repository.list_tous()]

    async def get_evenement(self, evenement_id: uuid.UUID) -> EvenementPublic | None:
        evenement = await self._evenement_repository.get(evenement_id)
        return self._to_public(evenement) if evenement else None

    async def create_evenement(self, saisie: EvenementSaisie) -> EvenementPublic:
        valide = _valider(saisie, est_creation=True)
        evenement = await self._evenement_repository.create(Evenement(**valide.__dict__))
        return self._to_public(evenement)

    async def update_evenement(self, evenement_id: uuid.UUID, saisie: EvenementSaisie) -> EvenementPublic:
        evenement = await self._get_ou_erreur(evenement_id)
        valide = _valider(saisie, est_creation=False)
        for champ, valeur in valide.__dict__.items():
            setattr(evenement, champ, valeur)
        evenement.updated_at = datetime.now(timezone.utc)
        return self._to_public(await self._evenement_repository.update(evenement))

    async def delete_evenement(self, evenement_id: uuid.UUID) -> None:
        await self._evenement_repository.delete(await self._get_ou_erreur(evenement_id))

    async def ics(self, evenement_id: uuid.UUID) -> str:
        e = await self._get_ou_erreur(evenement_id)
        jour_fin = e.date_fin or e.date_evenement
        if e.heure_fin is not None:
            fin = _utc_ics(jour_fin, e.heure_fin)
        else:
            debut_local = datetime.combine(jour_fin, e.heure_debut, tzinfo=FUSEAU_CLUB)
            fin = (debut_local + DUREE_PAR_DEFAUT).astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

        lignes = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Vovinam Sevran//Agenda//FR",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            f"UID:{e.id}@vovinam-sevran",
            f"DTSTAMP:{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}",
            f"DTSTART:{_utc_ics(e.date_evenement, e.heure_debut)}",
            f"DTEND:{fin}",
            f"SUMMARY:{_echapper_ics(e.titre)}",
        ]
        # Nom + adresse dans LOCATION : les agendas en font un lien vers l'itinéraire.
        location = ", ".join(v for v in (e.lieu, e.adresse) if v)
        if location:
            lignes.append(f"LOCATION:{_echapper_ics(location)}")
        if e.latitude is not None and e.longitude is not None:
            lignes.append(f"GEO:{e.latitude:.6f};{e.longitude:.6f}")
        if e.description:
            lignes.append(f"DESCRIPTION:{_echapper_ics(e.description)}")
        lignes += ["END:VEVENT", "END:VCALENDAR"]
        return "\r\n".join(_plier_ligne_ics(ligne) for ligne in lignes) + "\r\n"

    async def _get_ou_erreur(self, evenement_id: uuid.UUID) -> Evenement:
        evenement = await self._evenement_repository.get(evenement_id)
        if evenement is None:
            raise EvenementIntrouvableError("Événement introuvable.")
        return evenement

    @staticmethod
    def _to_public(e: Evenement) -> EvenementPublic:
        return EvenementPublic(
            id=e.id,
            titre=e.titre,
            type=e.type_evenement,
            date_debut=e.date_evenement,
            date_fin=e.date_fin,
            heure_debut=e.heure_debut.strftime("%H:%M"),
            heure_fin=e.heure_fin.strftime("%H:%M") if e.heure_fin else None,
            lieu=e.lieu,
            adresse=e.adresse,
            latitude=e.latitude,
            longitude=e.longitude,
            description=e.description,
        )
