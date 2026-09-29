import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.schemas.evenement import EvenementPublic, EvenementSaisie
from app.services.evenement_service import EvenementService
from app.utils.dependencies import get_evenement_service, require_admin
from app.utils.exceptions import EvenementIntrouvableError, EvenementInvalideError

public_router = APIRouter(prefix="/evenements", tags=["evenements"])
router = APIRouter(prefix="/evenements", tags=["evenements"], dependencies=[Depends(require_admin)])


@public_router.get("", response_model=list[EvenementPublic])
async def list_a_venir(
    limit: int | None = Query(None, ge=1, le=50),
    service: EvenementService = Depends(get_evenement_service),
) -> list[EvenementPublic]:
    return await service.list_a_venir(limit)


@public_router.get("/{evenement_id}/ics")
async def telecharger_ics(
    evenement_id: uuid.UUID, service: EvenementService = Depends(get_evenement_service)
) -> Response:
    try:
        contenu = await service.ics(evenement_id)
    except EvenementIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return Response(
        content=contenu,
        media_type="text/calendar; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="evenement-{evenement_id}.ics"'},
    )


@router.get("/tous", response_model=list[EvenementPublic])
async def list_tous(service: EvenementService = Depends(get_evenement_service)) -> list[EvenementPublic]:
    return await service.list_tous()


@router.get("/{evenement_id}", response_model=EvenementPublic)
async def get_evenement(
    evenement_id: uuid.UUID, service: EvenementService = Depends(get_evenement_service)
) -> EvenementPublic:
    evenement = await service.get_evenement(evenement_id)
    if evenement is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Événement introuvable.")
    return evenement


@router.post("", response_model=EvenementPublic, status_code=status.HTTP_201_CREATED)
async def create_evenement(
    saisie: EvenementSaisie, service: EvenementService = Depends(get_evenement_service)
) -> EvenementPublic:
    try:
        return await service.create_evenement(saisie)
    except EvenementInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/{evenement_id}", response_model=EvenementPublic)
async def update_evenement(
    evenement_id: uuid.UUID,
    saisie: EvenementSaisie,
    service: EvenementService = Depends(get_evenement_service),
) -> EvenementPublic:
    try:
        return await service.update_evenement(evenement_id, saisie)
    except EvenementIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except EvenementInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/{evenement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_evenement(
    evenement_id: uuid.UUID, service: EvenementService = Depends(get_evenement_service)
) -> None:
    try:
        await service.delete_evenement(evenement_id)
    except EvenementIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
