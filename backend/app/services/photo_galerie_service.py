import asyncio
import io
import uuid
from dataclasses import dataclass

from fastapi import UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from app.interface.file_storage_repository import IFileStorageRepository
from app.interface.photo_galerie_repository import IPhotoGalerieRepository
from app.models.photo_galerie import PhotoGalerie
from app.schemas.photo_galerie import PhotoGaleriePublic
from app.utils.exceptions import FichierInvalideError, PhotoIntrouvableError

_SUBDIR = "galerie"
_TAILLE_MAX_OCTETS = 5 * 1024 * 1024
_DIMENSION_AFFICHAGE_PIXELS = 1920
_DIMENSION_VIGNETTE_PIXELS = 400
_FORMAT_VERS_EXTENSION = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


@dataclass
class _CheminsFichiers:
    affichage: str
    vignette: str


@dataclass
class _ImagesTraitees:
    format_original: str
    bytes_affichage: bytes
    bytes_vignette: bytes


def _redimensionner(image: Image.Image, format_original: str, dimension_max: int) -> bytes:
    image.thumbnail((dimension_max, dimension_max), Image.Resampling.LANCZOS)
    tampon = io.BytesIO()
    options_sauvegarde = {"quality": 85} if format_original in ("JPEG", "WEBP") else {}
    image.save(tampon, format=format_original, **options_sauvegarde)
    return tampon.getvalue()


def _traiter_image(contenu: bytes) -> _ImagesTraitees:
    """Décodage/validation/redimensionnement Pillow — CPU-bound, exécuté hors de la boucle asyncio via asyncio.to_thread."""
    if len(contenu) > _TAILLE_MAX_OCTETS:
        raise FichierInvalideError("L'image dépasse la taille maximale autorisée (5 Mo).")

    # On ne fait confiance ni à l'extension ni au content-type déclarés par le client
    # (falsifiables) : on ouvre réellement le fichier comme image pour le valider.
    try:
        Image.open(io.BytesIO(contenu)).verify()
    except (UnidentifiedImageError, OSError) as exc:
        raise FichierInvalideError("Le fichier n'est pas une image valide.") from exc

    # verify() consomme l'objet ; on rouvre une image fraîche pour la traiter.
    image = Image.open(io.BytesIO(contenu))
    format_original = image.format
    if format_original not in _FORMAT_VERS_EXTENSION:
        formats = ", ".join(sorted(_FORMAT_VERS_EXTENSION))
        raise FichierInvalideError(f"Format d'image non supporté (formats autorisés : {formats}).")

    image = ImageOps.exif_transpose(image)
    a_de_la_transparence = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    if format_original in ("PNG", "WEBP") and a_de_la_transparence:
        image = image.convert("RGBA")
    else:
        image = image.convert("RGB")

    return _ImagesTraitees(
        format_original=format_original,
        bytes_affichage=_redimensionner(image.copy(), format_original, _DIMENSION_AFFICHAGE_PIXELS),
        bytes_vignette=_redimensionner(image.copy(), format_original, _DIMENSION_VIGNETTE_PIXELS),
    )


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
        resultat = await asyncio.to_thread(_traiter_image, contenu)

        extension = _FORMAT_VERS_EXTENSION[resultat.format_original]
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
