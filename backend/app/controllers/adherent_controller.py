import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.adherent import AdherentCreate, AdherentPublic, AdherentUpdate
from app.services.adherent_service import AdherentService
from app.utils.dependencies import get_adherent_service, require_admin
from app.utils.exceptions import AdherentIntrouvableError, LicenceDejaUtiliseeError

router = APIRouter(prefix="/adherents", tags=["adherents"], dependencies=[Depends(require_admin)])


@router.get("", response_model=list[AdherentPublic])
async def list_adherents(service: AdherentService = Depends(get_adherent_service)) -> list[AdherentPublic]:
    return await service.list_adherents()


@router.get("/{adherent_id}", response_model=AdherentPublic)
async def get_adherent(
    adherent_id: uuid.UUID, service: AdherentService = Depends(get_adherent_service)
) -> AdherentPublic:
    adherent = await service.get_adherent(adherent_id)
    if adherent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adhérent introuvable.")
    return adherent


@router.post("", response_model=AdherentPublic, status_code=status.HTTP_201_CREATED)
async def create_adherent(
    payload: AdherentCreate, service: AdherentService = Depends(get_adherent_service)
) -> AdherentPublic:
    try:
        return await service.create_adherent(payload)
    except LicenceDejaUtiliseeError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.put("/{adherent_id}", response_model=AdherentPublic)
async def update_adherent(
    adherent_id: uuid.UUID,
    payload: AdherentUpdate,
    service: AdherentService = Depends(get_adherent_service),
) -> AdherentPublic:
    try:
        return await service.update_adherent(adherent_id, payload)
    except AdherentIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except LicenceDejaUtiliseeError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.delete("/{adherent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_adherent(
    adherent_id: uuid.UUID, service: AdherentService = Depends(get_adherent_service)
) -> None:
    try:
        await service.deactivate_adherent(adherent_id)
    except AdherentIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
