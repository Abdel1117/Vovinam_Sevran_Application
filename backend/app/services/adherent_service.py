import uuid
from datetime import datetime, timezone

from app.interface.adherent_repository import IAdherentRepository
from app.interface.contact_urgence_repository import IContactUrgenceRepository
from app.models.adherent import Adherent, CertificatMedical, StatutCotisation, TypeAdherent
from app.models.contact_urgence import ContactUrgence
from app.schemas.adherent import AdherentCreate, AdherentPublic, AdherentUpdate, ContactUrgencePayload
from app.utils.exceptions import AdherentIntrouvableError, LicenceDejaUtiliseeError

_CATEGORIE_TO_TYPE = {
    "Enfants": TypeAdherent.ENFANT,
    "Adolescents": TypeAdherent.ADOLESCENT,
    "Adultes": TypeAdherent.ADULTE,
}
_TYPE_TO_CATEGORIE = {v: k for k, v in _CATEGORIE_TO_TYPE.items()}
_TYPE_TO_CATEGORIE[TypeAdherent.ENCADRANT] = "Adultes"

_STATUT_TO_COTISATION = {"À jour": StatutCotisation.A_JOUR, "En attente": StatutCotisation.EN_ATTENTE}
_COTISATION_TO_STATUT = {v: k for k, v in _STATUT_TO_COTISATION.items()}

_CERTIFICAT_TO_MEDICAL = {"Valide": CertificatMedical.VALIDE, "Manquant": CertificatMedical.MANQUANT}
_MEDICAL_TO_CERTIFICAT = {v: k for k, v in _CERTIFICAT_TO_MEDICAL.items()}

_ASSURANCE_TO_BOOL = {"Assuré": True, "Pas assuré": False}
_BOOL_TO_ASSURANCE = {True: "Assuré", False: "Pas assuré"}


class AdherentService:
    def __init__(
        self,
        adherent_repository: IAdherentRepository,
        contact_urgence_repository: IContactUrgenceRepository,
    ) -> None:
        self._adherent_repository = adherent_repository
        self._contact_urgence_repository = contact_urgence_repository

    async def list_adherents(self) -> list[AdherentPublic]:
        adherents = await self._adherent_repository.list()
        result: list[AdherentPublic] = []
        for adherent in adherents:
            contacts = await self._contact_urgence_repository.list_for_adherent(adherent.id)
            result.append(self._to_public(adherent, contacts))
        return result

    async def get_adherent(self, adherent_id: uuid.UUID | str) -> AdherentPublic | None:
        adherent = await self._adherent_repository.get(adherent_id)
        if adherent is None or not adherent.is_actif:
            return None
        contacts = await self._contact_urgence_repository.list_for_adherent(adherent.id)
        return self._to_public(adherent, contacts)

    async def create_adherent(self, payload: AdherentCreate) -> AdherentPublic:
        existant = await self._adherent_repository.get_by_licence(payload.licence)
        if existant is not None:
            raise LicenceDejaUtiliseeError(f'Un adhérent avec le n° de licence "{payload.licence}" existe déjà.')

        adherent = Adherent(**self._payload_to_fields(payload))
        adherent = await self._adherent_repository.create(adherent)
        contacts = await self._contact_urgence_repository.replace_for_adherent(
            adherent.id, self._contacts_from_payload(payload)
        )
        return self._to_public(adherent, contacts)

    async def update_adherent(self, adherent_id: uuid.UUID | str, payload: AdherentUpdate) -> AdherentPublic:
        adherent = await self._adherent_repository.get(adherent_id)
        if adherent is None or not adherent.is_actif:
            raise AdherentIntrouvableError(f'Aucun adhérent avec l\'id "{adherent_id}".')

        existant = await self._adherent_repository.get_by_licence(payload.licence)
        if existant is not None and existant.id != adherent.id:
            raise LicenceDejaUtiliseeError(f'Un adhérent avec le n° de licence "{payload.licence}" existe déjà.')

        for field, value in self._payload_to_fields(payload).items():
            setattr(adherent, field, value)
        adherent.updated_at = datetime.now(timezone.utc)
        adherent = await self._adherent_repository.update(adherent)
        contacts = await self._contact_urgence_repository.replace_for_adherent(
            adherent.id, self._contacts_from_payload(payload)
        )
        return self._to_public(adherent, contacts)

    async def deactivate_adherent(self, adherent_id: uuid.UUID | str) -> None:
        adherent = await self._adherent_repository.get(adherent_id)
        if adherent is None or not adherent.is_actif:
            raise AdherentIntrouvableError(f'Aucun adhérent avec l\'id "{adherent_id}".')
        await self._adherent_repository.deactivate(adherent_id)

    @staticmethod
    def _payload_to_fields(payload: AdherentCreate | AdherentUpdate) -> dict:
        return {
            "nom": payload.nom,
            "prenom": payload.prenom,
            "date_naissance": payload.naissance,
            "numero_licence": payload.licence,
            "grade": payload.grade,
            "couleur_ceinture": payload.couleur,
            "type_adherent": _CATEGORIE_TO_TYPE[payload.categorie],
            "telephone": payload.telephone,
            "email": payload.email,
            "adresse": payload.adresse,
            "code_postal": payload.code_postal,
            "statut_cotisation": _STATUT_TO_COTISATION[payload.statut],
            "certificat_medical": _CERTIFICAT_TO_MEDICAL[payload.certificat],
            "assurance_incluse": _ASSURANCE_TO_BOOL[payload.assurance],
        }

    @staticmethod
    def _contacts_from_payload(payload: AdherentCreate | AdherentUpdate) -> list[ContactUrgence]:
        return [
            ContactUrgence(nom=contact.nom, telephone=contact.telephone, lien=contact.lien or None)
            for contact in payload.contacts_urgence
        ]

    @staticmethod
    def _to_public(adherent: Adherent, contacts: list[ContactUrgence]) -> AdherentPublic:
        return AdherentPublic(
            id=adherent.id,
            nom=adherent.nom,
            prenom=adherent.prenom,
            naissance=adherent.date_naissance,
            licence=adherent.numero_licence,
            grade=adherent.grade,
            couleur=adherent.couleur_ceinture or "",
            categorie=_TYPE_TO_CATEGORIE[adherent.type_adherent],
            statut=_COTISATION_TO_STATUT[adherent.statut_cotisation],
            email=adherent.email or "",
            telephone=adherent.telephone,
            adresse=adherent.adresse or "",
            code_postal=adherent.code_postal or "",
            certificat=_MEDICAL_TO_CERTIFICAT[adherent.certificat_medical],
            assurance=_BOOL_TO_ASSURANCE[adherent.assurance_incluse],
            contacts_urgence=[
                ContactUrgencePayload(nom=contact.nom, telephone=contact.telephone, lien=contact.lien or "")
                for contact in contacts
            ],
        )
