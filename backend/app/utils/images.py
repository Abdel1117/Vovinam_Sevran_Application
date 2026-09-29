import io
from dataclasses import dataclass

from PIL import Image, ImageOps, UnidentifiedImageError

from app.utils.exceptions import FichierInvalideError

TAILLE_MAX_OCTETS = 5 * 1024 * 1024
FORMAT_VERS_EXTENSION = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


@dataclass
class ImagesTraitees:
    format_original: str
    bytes_affichage: bytes
    bytes_vignette: bytes

    @property
    def extension(self) -> str:
        return FORMAT_VERS_EXTENSION[self.format_original]


def _redimensionner(image: Image.Image, format_original: str, dimension_max: int) -> bytes:
    image.thumbnail((dimension_max, dimension_max), Image.Resampling.LANCZOS)
    tampon = io.BytesIO()
    options_sauvegarde = {"quality": 85} if format_original in ("JPEG", "WEBP") else {}
    image.save(tampon, format=format_original, **options_sauvegarde)
    return tampon.getvalue()


def traiter_image(contenu: bytes, dimension_affichage: int, dimension_vignette: int) -> ImagesTraitees:
    """Décodage/validation/redimensionnement Pillow — CPU-bound, à exécuter hors de la boucle asyncio via asyncio.to_thread."""
    if len(contenu) > TAILLE_MAX_OCTETS:
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
    if format_original not in FORMAT_VERS_EXTENSION:
        formats = ", ".join(sorted(FORMAT_VERS_EXTENSION))
        raise FichierInvalideError(f"Format d'image non supporté (formats autorisés : {formats}).")

    image = ImageOps.exif_transpose(image)
    a_de_la_transparence = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    if format_original in ("PNG", "WEBP") and a_de_la_transparence:
        image = image.convert("RGBA")
    else:
        image = image.convert("RGB")

    return ImagesTraitees(
        format_original=format_original,
        bytes_affichage=_redimensionner(image.copy(), format_original, dimension_affichage),
        bytes_vignette=_redimensionner(image.copy(), format_original, dimension_vignette),
    )
