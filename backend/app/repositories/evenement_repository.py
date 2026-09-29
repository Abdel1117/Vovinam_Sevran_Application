import uuid
from datetime import date

from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.evenement_repository import IEvenementRepository
from app.models.evenement import Evenement


class EvenementRepository(IEvenementRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_a_venir(self, aujourd_hui: date, limit: int | None = None) -> list[Evenement]:
        # Un événement sur plusieurs jours reste « à venir » jusqu'à sa date de fin.
        fin = func.coalesce(Evenement.date_fin, Evenement.date_evenement)
        statement = (
            select(Evenement)
            .where(fin >= aujourd_hui)
            .order_by(Evenement.date_evenement, Evenement.heure_debut)
            .limit(limit)
        )
        result = await self._session.exec(statement)
        return list(result.all())

    async def list_tous(self) -> list[Evenement]:
        statement = select(Evenement).order_by(Evenement.date_evenement.desc(), Evenement.heure_debut.desc())
        result = await self._session.exec(statement)
        return list(result.all())

    async def get(self, evenement_id: uuid.UUID | str) -> Evenement | None:
        return await self._session.get(Evenement, evenement_id)

    async def create(self, evenement: Evenement) -> Evenement:
        self._session.add(evenement)
        await self._session.commit()
        await self._session.refresh(evenement)
        return evenement

    async def update(self, evenement: Evenement) -> Evenement:
        self._session.add(evenement)
        await self._session.commit()
        await self._session.refresh(evenement)
        return evenement

    async def delete(self, evenement: Evenement) -> None:
        await self._session.delete(evenement)
        await self._session.commit()
