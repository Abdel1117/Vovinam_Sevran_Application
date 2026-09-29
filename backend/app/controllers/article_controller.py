from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.models.user import User
from app.schemas.article import ArticlePublic
from app.services.article_service import ArticleSaisie, ArticleService
from app.utils.dependencies import get_article_service, require_admin
from app.utils.exceptions import ArticleIntrouvableError, ArticleInvalideError, FichierInvalideError

public_router = APIRouter(prefix="/articles", tags=["articles"])
router = APIRouter(prefix="/articles", tags=["articles"], dependencies=[Depends(require_admin)])


def _saisie(
    titre: str = Form(...),
    categorie: str = Form(...),
    chapo: str = Form(...),
    corps: str = Form(..., description="Liste de blocs au format JSON"),
    tags: str = Form("[]", description="Liste d'étiquettes au format JSON"),
    facebook_url: str | None = Form(None),
    instagram_url: str | None = Form(None),
    youtube_url: str | None = Form(None),
) -> ArticleSaisie:
    return ArticleSaisie(
        titre=titre,
        categorie=categorie,
        chapo=chapo,
        corps=corps,
        tags=tags,
        facebook_url=facebook_url,
        instagram_url=instagram_url,
        youtube_url=youtube_url,
    )


@public_router.get("", response_model=list[ArticlePublic])
async def list_articles(
    tag: str | None = None, service: ArticleService = Depends(get_article_service)
) -> list[ArticlePublic]:
    return await service.list_articles(tag)


@public_router.get("/{slug}", response_model=ArticlePublic)
async def get_article(slug: str, service: ArticleService = Depends(get_article_service)) -> ArticlePublic:
    article = await service.get_article(slug)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable.")
    return article


@router.post("", response_model=ArticlePublic, status_code=status.HTTP_201_CREATED)
async def create_article(
    saisie: ArticleSaisie = Depends(_saisie),
    fichier: UploadFile = File(...),
    auteur: User = Depends(require_admin),
    service: ArticleService = Depends(get_article_service),
) -> ArticlePublic:
    try:
        return await service.create_article(saisie, fichier, auteur)
    except (ArticleInvalideError, FichierInvalideError) as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/{slug}", response_model=ArticlePublic)
async def update_article(
    slug: str,
    saisie: ArticleSaisie = Depends(_saisie),
    fichier: UploadFile | None = File(None),
    service: ArticleService = Depends(get_article_service),
) -> ArticlePublic:
    try:
        return await service.update_article(slug, saisie, fichier)
    except ArticleIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except (ArticleInvalideError, FichierInvalideError) as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(slug: str, service: ArticleService = Depends(get_article_service)) -> None:
    try:
        await service.delete_article(slug)
    except ArticleIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
