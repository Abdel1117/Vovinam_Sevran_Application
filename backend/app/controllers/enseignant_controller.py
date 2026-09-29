import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.schemas.enseignant import EnseignantPublic
from app.services.enseignant_service import EnseignantSaisie, EnseignantService
from app.utils.dependencies import get_enseignant_service, require_admin
from app.utils.exceptions import EnseignantIntrouvableError, EnseignantInvalideError, FichierInvalideError

public_router = APIRouter(prefix="/enseignants", tags=["enseignants"])
router = APIRouter(prefix="/enseignants", tags=["enseignants"], dependencies=[Depends(require_admin)])


def _saisie(
    nom: str = Form(...),
    grade: str = Form(...),
    role: str = Form(...),
    texte: str | None = Form(None),
    ordre: int | None = Form(None),
) -> EnseignantSaisie:
    return EnseignantSaisie(nom=nom, grade=grade, role=role, texte=texte, ordre=ordre)


@public_router.get("", response_model=list[EnseignantPublic])
async def list_enseignants(service: EnseignantService = Depends(get_enseignant_service)) -> list[EnseignantPublic]:
    return await service.list_enseignants()


@router.get("/{enseignant_id}", response_model=EnseignantPublic)
async def get_enseignant(
    enseignant_id: uuid.UUID, service: EnseignantService = Depends(get_enseignant_service)
) -> EnseignantPublic:
    enseignant = await service.get_enseignant(enseignant_id)
    if enseignant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enseignant introuvable.")
    return enseignant


@router.post("", response_model=EnseignantPublic, status_code=status.HTTP_201_CREATED)
async def create_enseignant(
    saisie: EnseignantSaisie = Depends(_saisie),
    photo: UploadFile | None = File(None),
    service: EnseignantService = Depends(get_enseignant_service),
) -> EnseignantPublic:
    try:
        return await service.create_enseignant(saisie, photo)
    except (EnseignantInvalideError, FichierInvalideError) as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/{enseignant_id}", response_model=EnseignantPublic)
async def update_enseignant(
    enseignant_id: uuid.UUID,
    saisie: EnseignantSaisie = Depends(_saisie),
    photo: UploadFile | None = File(None),
    supprimer_photo: bool = Form(False),
    service: EnseignantService = Depends(get_enseignant_service),
) -> EnseignantPublic:
    try:
        return await service.update_enseignant(enseignant_id, saisie, photo, supprimer_photo)
    except EnseignantIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except (EnseignantInvalideError, FichierInvalideError) as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/{enseignant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enseignant(
    enseignant_id: uuid.UUID, service: EnseignantService = Depends(get_enseignant_service)
) -> None:
    try:
        await service.delete_enseignant(enseignant_id)
    except EnseignantIntrouvableError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
