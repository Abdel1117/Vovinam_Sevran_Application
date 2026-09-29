import asyncio
import json
import re
import unicodedata
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import UploadFile
from pydantic import TypeAdapter, ValidationError

from app.interface.article_repository import IArticleRepository
from app.interface.file_storage_repository import IFileStorageRepository
from app.models.article import Article
from app.models.user import User
from app.schemas.article import ArticlePublic, Bloc
from app.utils.exceptions import ArticleIntrouvableError, ArticleInvalideError
from app.utils.images import traiter_image

_SUBDIR = "articles"
_DIMENSION_AFFICHAGE_PIXELS = 1920
_DIMENSION_VIGNETTE_PIXELS = 800
_AUTEUR_PAR_DEFAUT = "Vovinam Sevran"
_MOTS_PAR_MINUTE = 200

CATEGORIES = ("Stage", "Compétition", "Vie du club", "Passage de grades", "Fédération")
TITRE_MIN, TITRE_MAX = 5, 120
CHAPO_MIN, CHAPO_MAX = 30, 220
CORPS_MIN, CORPS_MAX = 100, 20_000
TAGS_MAX = 8
URL_MAX = 500

_REGEX_TAG = re.compile(r"^[a-z0-9à-öø-ÿœæ][a-z0-9à-öø-ÿœæ -]{1,29}$")
_REGEX_RESEAUX = {
    "facebook": (re.compile(r"^https://(www\.|m\.)?(facebook\.com|fb\.watch)/\S+$"), "Facebook"),
    "instagram": (re.compile(r"^https://(www\.)?instagram\.com/\S+$"), "Instagram"),
    "youtube": (re.compile(r"^https://(www\.|m\.)?(youtube\.com/\S+|youtu\.be/\S+)$"), "YouTube"),
}
_BLOCS_ADAPTER = TypeAdapter(list[Bloc])
_TAGS_ADAPTER = TypeAdapter(list[str])


@dataclass
class ArticleSaisie:
    """Champs texte bruts reçus du formulaire multipart (corps et tags en JSON)."""

    titre: str
    categorie: str
    chapo: str
    corps: str
    tags: str
    facebook_url: str | None = None
    instagram_url: str | None = None
    youtube_url: str | None = None


@dataclass
class _ArticleValide:
    titre: str
    categorie: str
    chapo: str
    corps: list[Bloc]
    tags: list[str]
    facebook_url: str | None
    instagram_url: str | None
    youtube_url: str | None


def slugify(valeur: str) -> str:
    sans_accents = unicodedata.normalize("NFD", valeur.lower())
    sans_accents = "".join(c for c in sans_accents if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", sans_accents).strip("-")[:60].strip("-")


def _valider_url(valeur: str | None, reseau: str) -> str | None:
    valeur = (valeur or "").strip()
    if not valeur:
        return None
    regex, nom = _REGEX_RESEAUX[reseau]
    if len(valeur) > URL_MAX or not regex.match(valeur):
        raise ArticleInvalideError(f"Le lien {nom} n'est pas valide.")
    return valeur


def _valider(saisie: ArticleSaisie) -> _ArticleValide:
    titre = " ".join(saisie.titre.split())
    if not TITRE_MIN <= len(titre) <= TITRE_MAX:
        raise ArticleInvalideError(f"Le titre doit faire entre {TITRE_MIN} et {TITRE_MAX} caractères.")
    if not re.search(r"[^\W\d_]", titre):
        raise ArticleInvalideError("Le titre doit contenir au moins une lettre.")

    if saisie.categorie not in CATEGORIES:
        raise ArticleInvalideError("Catégorie inconnue.")

    chapo = saisie.chapo.strip()
    if not CHAPO_MIN <= len(chapo) <= CHAPO_MAX:
        raise ArticleInvalideError(f"Le chapô doit faire entre {CHAPO_MIN} et {CHAPO_MAX} caractères.")

    try:
        blocs = _BLOCS_ADAPTER.validate_json(saisie.corps)
    except ValidationError as exc:
        raise ArticleInvalideError("Le contenu de l'article est mal formé.") from exc
    blocs = [Bloc(type=b.type, texte=b.texte.strip()) for b in blocs if b.texte.strip()]
    longueur = sum(len(b.texte) for b in blocs)
    if not CORPS_MIN <= longueur <= CORPS_MAX:
        raise ArticleInvalideError(f"Le contenu doit faire entre {CORPS_MIN} et {CORPS_MAX} caractères.")
    if not any(b.type == "p" for b in blocs):
        raise ArticleInvalideError("Le contenu doit contenir au moins un paragraphe.")

    try:
        tags_bruts = _TAGS_ADAPTER.validate_json(saisie.tags or "[]")
    except ValidationError as exc:
        raise ArticleInvalideError("Les étiquettes sont mal formées.") from exc
    tags: list[str] = []
    for tag in tags_bruts:
        tag = " ".join(tag.lower().split())
        if not tag or tag in tags:
            continue
        if not _REGEX_TAG.match(tag):
            raise ArticleInvalideError(
                f'Étiquette "{tag}" invalide : 2 à 30 caractères, lettres, chiffres, espaces ou tirets.'
            )
        tags.append(tag)
    if len(tags) > TAGS_MAX:
        raise ArticleInvalideError(f"{TAGS_MAX} étiquettes maximum.")

    return _ArticleValide(
        titre=titre,
        categorie=saisie.categorie,
        chapo=chapo,
        corps=blocs,
        tags=tags,
        facebook_url=_valider_url(saisie.facebook_url, "facebook"),
        instagram_url=_valider_url(saisie.instagram_url, "instagram"),
        youtube_url=_valider_url(saisie.youtube_url, "youtube"),
    )


def _temps_de_lecture(corps: list[dict]) -> str:
    mots = sum(len(str(bloc.get("texte", "")).split()) for bloc in corps)
    return f"{max(1, round(mots / _MOTS_PAR_MINUTE))} min"


class ArticleService:
    def __init__(self, article_repository: IArticleRepository, file_storage: IFileStorageRepository) -> None:
        self._article_repository = article_repository
        self._file_storage = file_storage

    async def list_articles(self, tag: str | None = None) -> list[ArticlePublic]:
        articles = await self._article_repository.list(tag.strip().lower() if tag else None)
        return [self._to_public(article) for article in articles]

    async def get_article(self, slug: str) -> ArticlePublic | None:
        article = await self._article_repository.get_by_slug(slug)
        return self._to_public(article) if article else None

    async def create_article(self, saisie: ArticleSaisie, fichier: UploadFile, auteur: User) -> ArticlePublic:
        valide = _valider(saisie)
        slug = await self._slug_disponible(valide.titre)
        chemin_image, chemin_vignette = await self._enregistrer_image(fichier)
        article = Article(
            slug=slug,
            chemin_image=chemin_image,
            chemin_vignette=chemin_vignette,
            auteur_id=auteur.id,
            **self._champs(valide),
        )
        article = await self._article_repository.create(article)
        return self._to_public(article)

    async def update_article(self, slug: str, saisie: ArticleSaisie, fichier: UploadFile | None) -> ArticlePublic:
        article = await self._article_repository.get_by_slug(slug)
        if article is None:
            raise ArticleIntrouvableError(f'Aucun article avec le lien "{slug}".')

        valide = _valider(saisie)
        # Le slug n'est pas régénéré : les liens déjà partagés restent valides.
        for champ, valeur in self._champs(valide).items():
            setattr(article, champ, valeur)
        article.updated_at = datetime.now(timezone.utc)

        if fichier is not None:
            anciens_chemins = (article.chemin_image, article.chemin_vignette)
            article.chemin_image, article.chemin_vignette = await self._enregistrer_image(fichier)
            for ancien_chemin in anciens_chemins:
                await self._file_storage.delete(ancien_chemin)

        article = await self._article_repository.update(article)
        return self._to_public(article)

    async def delete_article(self, slug: str) -> None:
        article = await self._article_repository.get_by_slug(slug)
        if article is None:
            raise ArticleIntrouvableError(f'Aucun article avec le lien "{slug}".')
        chemins = (article.chemin_image, article.chemin_vignette)
        await self._article_repository.delete(article)
        for chemin in chemins:
            await self._file_storage.delete(chemin)

    @staticmethod
    def _champs(valide: _ArticleValide) -> dict:
        return {
            "titre": valide.titre,
            "categorie": valide.categorie,
            "chapo": valide.chapo,
            "corps": [bloc.model_dump() for bloc in valide.corps],
            "tags": valide.tags,
            "facebook_url": valide.facebook_url,
            "instagram_url": valide.instagram_url,
            "youtube_url": valide.youtube_url,
        }

    async def _slug_disponible(self, titre: str) -> str:
        base = slugify(titre) or "article"
        slug, suffixe = base, 2
        while await self._article_repository.slug_exists(slug):
            slug = f"{base}-{suffixe}"
            suffixe += 1
        return slug

    async def _enregistrer_image(self, fichier: UploadFile) -> tuple[str, str]:
        contenu = await fichier.read()
        resultat = await asyncio.to_thread(
            traiter_image, contenu, _DIMENSION_AFFICHAGE_PIXELS, _DIMENSION_VIGNETTE_PIXELS
        )
        chemin_image = await self._file_storage.save(
            _SUBDIR, f"{uuid.uuid4().hex}{resultat.extension}", resultat.bytes_affichage
        )
        chemin_vignette = await self._file_storage.save(
            _SUBDIR, f"{uuid.uuid4().hex}{resultat.extension}", resultat.bytes_vignette
        )
        return chemin_image, chemin_vignette

    def _to_public(self, article: Article) -> ArticlePublic:
        auteur = f"{article.auteur.prenom} {article.auteur.nom}" if article.auteur else _AUTEUR_PAR_DEFAUT
        return ArticlePublic(
            id=article.id,
            slug=article.slug,
            titre=article.titre,
            categorie=article.categorie,
            chapo=article.chapo,
            corps=article.corps,
            tags=article.tags,
            image=self._file_storage.url_for(article.chemin_image),
            vignette=self._file_storage.url_for(article.chemin_vignette),
            facebook_url=article.facebook_url,
            instagram_url=article.instagram_url,
            youtube_url=article.youtube_url,
            auteur=auteur,
            date=article.created_at,
            lecture=_temps_de_lecture(article.corps),
        )
