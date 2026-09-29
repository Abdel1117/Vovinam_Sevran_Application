import asyncio
import uuid
from dataclasses import dataclass

from fastapi import UploadFile

from app.interface.file_storage_repository import IFileStorageRepository
from app.interface.photo_galerie_repository import IPhotoGalerieRepository
from app.models.photo_galerie import PhotoGalerie
from app.schemas.photo_galerie import PhotoGaleriePublic
from app.utils.exceptions import PhotoIntrouvableError
from app.utils.images import traiter_image

_SUBDIR = "galerie"
_DIMENSION_AFFICHAGE_PIXELS = 1920
_DIMENSION_VIGNETTE_PIXELS = 400


@dataclass
class _CheminsFichiers:
    affichage: str
    vignette: str


class PhotoGalerieService:
    def __init__(
        self,
        photo_repository: IPhotoGalerieRepository,
        file_storage: IFileStorageRepository,
    ) -> None:
        self._photo_repository = photo_repository
        self._file_storage = file_storage

    async def list_photos(self) -> list[PhotoGaleriePublic]:
        photos = await self._photo_repository.list()
        return [self._to_public(photo) for photo in photos]

    async def get_photo(self, photo_id: uuid.UUID | str) -> PhotoGaleriePublic | None:
        photo = await self._photo_repository.get(photo_id)
        return self._to_public(photo) if photo else None

    async def create_photo(
        self, titre: str, categorie: str, date: str, fichier: UploadFile
    ) -> PhotoGaleriePublic:
        chemins = await self._enregistrer_fichier(fichier)
        photo = PhotoGalerie(
            titre=titre,
            categorie=categorie,
            date_legende=date,
            chemin_fichier=chemins.affichage,
            chemin_vignette=chemins.vignette,
        )
        photo = await self._photo_repository.create(photo)
        return self._to_public(photo)

    async def update_photo(
        self,
        photo_id: uuid.UUID | str,
        titre: str,
        categorie: str,
        date: str,
        fichier: UploadFile | None,
    ) -> PhotoGaleriePublic:
        photo = await self._photo_repository.get(photo_id)
        if photo is None:
            raise PhotoIntrouvableError(f'Aucune photo avec l\'id "{photo_id}".')

        photo.titre = titre
        photo.categorie = categorie
        photo.date_legende = date

        if fichier is not None:
            anciens_chemins = (photo.chemin_fichier, photo.chemin_vignette)
            chemins = await self._enregistrer_fichier(fichier)
            photo.chemin_fichier = chemins.affichage
            photo.chemin_vignette = chemins.vignette
            for ancien_chemin in anciens_chemins:
                if ancien_chemin:
                    await self._file_storage.delete(ancien_chemin)

        photo = await self._photo_repository.update(photo)
        return self._to_public(photo)

    async def delete_photo(self, photo_id: uuid.UUID | str) -> None:
        photo = await self._photo_repository.get(photo_id)
        if photo is None:
            raise PhotoIntrouvableError(f'Aucune photo avec l\'id "{photo_id}".')
        await self._photo_repository.delete(photo_id)
        await self._file_storage.delete(photo.chemin_fichier)
        if photo.chemin_vignette:
            await self._file_storage.delete(photo.chemin_vignette)

    async def _enregistrer_fichier(self, fichier: UploadFile) -> _CheminsFichiers:
        contenu = await fichier.read()
        # Décodage/redimensionnement Pillow = CPU-bound et synchrone : on le sort de la
        # boucle asyncio pour ne pas bloquer le serveur pendant le traitement (multi-upload).
        resultat = await asyncio.to_thread(
            traiter_image, contenu, _DIMENSION_AFFICHAGE_PIXELS, _DIMENSION_VIGNETTE_PIXELS
        )

        extension = resultat.extension
        chemin_affichage = await self._file_storage.save(
            _SUBDIR, f"{uuid.uuid4().hex}{extension}", resultat.bytes_affichage
        )
        chemin_vignette = await self._file_storage.save(
            _SUBDIR, f"{uuid.uuid4().hex}{extension}", resultat.bytes_vignette
        )
        return _CheminsFichiers(affichage=chemin_affichage, vignette=chemin_vignette)

    def _to_public(self, photo: PhotoGalerie) -> PhotoGaleriePublic:
        chemin_vignette = photo.chemin_vignette or photo.chemin_fichier
        return PhotoGaleriePublic(
            id=photo.id,
            titre=photo.titre,
            categorie=photo.categorie,
            date=photo.date_legende,
            url=self._file_storage.url_for(photo.chemin_fichier),
            vignette=self._file_storage.url_for(chemin_vignette),
        )
