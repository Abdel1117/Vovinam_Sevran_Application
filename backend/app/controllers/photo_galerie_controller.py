import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.schemas.photo_galerie import PhotoGaleriePublic
from app.services.photo_galerie_service import PhotoGalerieService
from app.utils.dependencies import get_photo_galerie_service, require_admin
from app.utils.exceptions import FichierInvalideError, PhotoIntrouvableError

public_router = APIRouter(prefix="/galerie", tags=["galerie"])
router = APIRouter(prefix="/galerie", tags=["galerie"], dependencies=[Depends(require_admin)])


@public_router.get("", response_model=list[PhotoGaleriePublic])
async def list_photos(service: PhotoGalerieService = Depends(get_photo_galerie_service)) -> list[PhotoGaleriePublic]:
    return await service.list_photos()


@router.get("/{photo_id}", response_model=PhotoGaleriePublic)
async def get_photo(
    photo_id: uuid.UUID, service: PhotoGalerieService = Depends(get_photo_galerie_service)
) -> PhotoGaleriePublic:
    photo = await service.get_photo(photo_id)
    if photo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo introuvable.")
    return photo


@router.post("", response_model=PhotoGaleriePublic, status_code=status.HTTP_201_CREATED)
async def create_photo(
    titre: str = Form(...),
    categorie: str = Form(...),
    date: str = Form(...),
    fichier: UploadFile = File(...),
    service: PhotoGalerieService = Depends(get_photo_galerie_service),
) -> PhotoGaleriePublic:
    try:
        return await service.create_photo(titre, categorie, date, fichier)
    except FichierInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/{photo_id}", response_model=PhotoGaleriePublic)
async def update_photo(
    photo_id: uuid.UUID,
    titre: str = Form(...),
    categorie: str = Form(...),
    date: str = Form(...),
    fichier: UploadFile | None = File(None),
    service: PhotoGalerieService = Depends(get_photo_galerie_service),
) -> PhotoGaleriePublic:
    try:
        return await service.update_photo(photo_id, titre, categorie, date, fichier)
    except PhotoIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except FichierInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(
    photo_id: uuid.UUID, service: PhotoGalerieService = Depends(get_photo_galerie_service)
) -> None:
    try:
        await service.delete_photo(photo_id)
    except PhotoIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
