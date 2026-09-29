import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.demande_essai import DemandeEssaiAdminSaisie, DemandeEssaiPublic, DemandeEssaiPubliqueSaisie
from app.services.demande_essai_service import DemandeEssaiService
from app.utils.dependencies import get_demande_essai_service, require_admin
from app.utils.exceptions import DemandeIntrouvableError, DemandeInvalideError
from app.utils.rate_limit import RateLimiter

public_router = APIRouter(prefix="/demandes-essai", tags=["demandes-essai"])
router = APIRouter(prefix="/demandes-essai", tags=["demandes-essai"], dependencies=[Depends(require_admin)])

# 5 demandes par tranche de 10 minutes et par IP : largement assez pour une famille.
_limite_formulaire = RateLimiter(max_requetes=5, fenetre_secondes=600)


@public_router.post("", status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(_limite_formulaire)])
async def recevoir_demande(
    saisie: DemandeEssaiPubliqueSaisie, service: DemandeEssaiService = Depends(get_demande_essai_service)
) -> dict[str, str]:
    try:
        await service.recevoir_demande(saisie)
    except DemandeInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return {"detail": "Demande reçue."}


@router.get("", response_model=list[DemandeEssaiPublic])
async def list_demandes(
    statut: str | None = None,
    limit: int | None = Query(None, ge=1, le=200),
    service: DemandeEssaiService = Depends(get_demande_essai_service),
) -> list[DemandeEssaiPublic]:
    try:
        return await service.list_demandes(statut, limit)
    except DemandeInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/manuelle", response_model=DemandeEssaiPublic, status_code=status.HTTP_201_CREATED)
async def create_demande(
    saisie: DemandeEssaiAdminSaisie, service: DemandeEssaiService = Depends(get_demande_essai_service)
) -> DemandeEssaiPublic:
    try:
        return await service.create_demande(saisie)
    except DemandeInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/{demande_id}", response_model=DemandeEssaiPublic)
async def get_demande(
    demande_id: uuid.UUID, service: DemandeEssaiService = Depends(get_demande_essai_service)
) -> DemandeEssaiPublic:
    demande = await service.get_demande(demande_id)
    if demande is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demande introuvable.")
    return demande


@router.put("/{demande_id}", response_model=DemandeEssaiPublic)
async def update_demande(
    demande_id: uuid.UUID,
    saisie: DemandeEssaiAdminSaisie,
    service: DemandeEssaiService = Depends(get_demande_essai_service),
) -> DemandeEssaiPublic:
    try:
        return await service.update_demande(demande_id, saisie)
    except DemandeIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except DemandeInvalideError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/{demande_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_demande(
    demande_id: uuid.UUID, service: DemandeEssaiService = Depends(get_demande_essai_service)
) -> None:
    try:
        await service.delete_demande(demande_id)
    except DemandeIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
