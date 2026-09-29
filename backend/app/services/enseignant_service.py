import asyncio
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import UploadFile

from app.interface.enseignant_repository import IEnseignantRepository
from app.interface.file_storage_repository import IFileStorageRepository
from app.models.enseignant import Enseignant
from app.schemas.enseignant import EnseignantPublic
from app.utils.exceptions import EnseignantIntrouvableError, EnseignantInvalideError
from app.utils.images import traiter_image

_SUBDIR = "enseignants"
_DIMENSION_PHOTO_PIXELS = 800
NOM_MIN, NOM_MAX = 2, 80
GRADE_MIN, GRADE_MAX = 2, 60
ROLE_MIN, ROLE_MAX = 2, 60
TEXTE_MAX = 300
ORDRE_MAX = 999


@dataclass
class EnseignantSaisie:
    nom: str
    grade: str
    role: str
    texte: str | None
    ordre: int | None


def _texte_court(valeur: str, champ: str, minimum: int, maximum: int) -> str:
    valeur = " ".join(valeur.split())
    if not minimum <= len(valeur) <= maximum:
        raise EnseignantInvalideError(f"{champ} doit faire entre {minimum} et {maximum} caractères.")
    return valeur


def _valider(saisie: EnseignantSaisie) -> dict:
    nom = _texte_court(saisie.nom, "Le nom", NOM_MIN, NOM_MAX)
    if not re.search(r"[^\W\d_]", nom):
        raise EnseignantInvalideError("Le nom doit contenir au moins une lettre.")
    texte = (saisie.texte or "").strip() or None
    if texte and len(texte) > TEXTE_MAX:
        raise EnseignantInvalideError(f"La présentation ne doit pas dépasser {TEXTE_MAX} caractères.")
    if saisie.ordre is not None and not 0 <= saisie.ordre <= ORDRE_MAX:
        raise EnseignantInvalideError(f"L'ordre doit être compris entre 0 et {ORDRE_MAX}.")
    return {
        "nom": nom,
        "grade": _texte_court(saisie.grade, "Le grade", GRADE_MIN, GRADE_MAX),
        "role": _texte_court(saisie.role, "Le rôle", ROLE_MIN, ROLE_MAX),
        "texte": texte,
    }


class EnseignantService:
    def __init__(self, enseignant_repository: IEnseignantRepository, file_storage: IFileStorageRepository) -> None:
        self._enseignant_repository = enseignant_repository
        self._file_storage = file_storage

    async def list_enseignants(self) -> list[EnseignantPublic]:
        return [self._to_public(e) for e in await self._enseignant_repository.list()]

    async def get_enseignant(self, enseignant_id: uuid.UUID) -> EnseignantPublic | None:
        enseignant = await self._enseignant_repository.get(enseignant_id)
        return self._to_public(enseignant) if enseignant else None

    async def create_enseignant(self, saisie: EnseignantSaisie, photo: UploadFile | None) -> EnseignantPublic:
        champs = _valider(saisie)
        # Sans ordre précisé, le nouvel enseignant s'affiche en dernier.
        ordre = saisie.ordre if saisie.ordre is not None else await self._enseignant_repository.ordre_max() + 1
        chemin_photo = await self._enregistrer_photo(photo) if photo else None
        enseignant = Enseignant(**champs, ordre=ordre, chemin_photo=chemin_photo)
        return self._to_public(await self._enseignant_repository.create(enseignant))

    async def update_enseignant(
        self,
        enseignant_id: uuid.UUID,
        saisie: EnseignantSaisie,
        photo: UploadFile | None,
        supprimer_photo: bool,
    ) -> EnseignantPublic:
        enseignant = await self._get_ou_erreur(enseignant_id)
        for champ, valeur in _valider(saisie).items():
            setattr(enseignant, champ, valeur)
        if saisie.ordre is not None:
            enseignant.ordre = saisie.ordre

        ancienne_photo = enseignant.chemin_photo
        if photo is not None:
            enseignant.chemin_photo = await self._enregistrer_photo(photo)
        elif supprimer_photo:
            enseignant.chemin_photo = None
        enseignant.updated_at = datetime.now(timezone.utc)

        enseignant = await self._enseignant_repository.update(enseignant)
        if ancienne_photo and ancienne_photo != enseignant.chemin_photo:
            await self._file_storage.delete(ancienne_photo)
        return self._to_public(enseignant)

    async def delete_enseignant(self, enseignant_id: uuid.UUID) -> None:
        enseignant = await self._get_ou_erreur(enseignant_id)
        chemin_photo = enseignant.chemin_photo
        await self._enseignant_repository.delete(enseignant)
        if chemin_photo:
            await self._file_storage.delete(chemin_photo)

    async def _get_ou_erreur(self, enseignant_id: uuid.UUID) -> Enseignant:
        enseignant = await self._enseignant_repository.get(enseignant_id)
        if enseignant is None:
            raise EnseignantIntrouvableError("Enseignant introuvable.")
        return enseignant

    async def _enregistrer_photo(self, photo: UploadFile) -> str:
        contenu = await photo.read()
        resultat = await asyncio.to_thread(traiter_image, contenu, _DIMENSION_PHOTO_PIXELS, _DIMENSION_PHOTO_PIXELS)
        return await self._file_storage.save(
            _SUBDIR, f"{uuid.uuid4().hex}{resultat.extension}", resultat.bytes_affichage
        )

    def _to_public(self, e: Enseignant) -> EnseignantPublic:
        return EnseignantPublic(
            id=e.id,
            nom=e.nom,
            grade=e.grade,
            role=e.role,
            texte=e.texte,
            photo=self._file_storage.url_for(e.chemin_photo) if e.chemin_photo else None,
            ordre=e.ordre,
        )
