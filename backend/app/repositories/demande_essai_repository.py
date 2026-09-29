import uuid

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.demande_essai_repository import IDemandeEssaiRepository
from app.models.demande_essai import DemandeEssai, StatutDemande


class DemandeEssaiRepository(IDemandeEssaiRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list(self, statut: StatutDemande | None = None, limit: int | None = None) -> list[DemandeEssai]:
        statement = select(DemandeEssai).order_by(DemandeEssai.created_at.desc()).limit(limit)
        if statut is not None:
            statement = statement.where(DemandeEssai.statut == statut)
        result = await self._session.exec(statement)
        return list(result.all())

    async def get(self, demande_id: uuid.UUID | str) -> DemandeEssai | None:
        return await self._session.get(DemandeEssai, demande_id)

    async def create(self, demande: DemandeEssai) -> DemandeEssai:
        self._session.add(demande)
        await self._session.commit()
        await self._session.refresh(demande)
        return demande

    async def update(self, demande: DemandeEssai) -> DemandeEssai:
        self._session.add(demande)
        await self._session.commit()
        await self._session.refresh(demande)
        return demande

    async def delete(self, demande: DemandeEssai) -> None:
        await self._session.delete(demande)
        await self._session.commit()
