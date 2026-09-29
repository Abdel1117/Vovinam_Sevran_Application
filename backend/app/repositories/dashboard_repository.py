from datetime import date, datetime

from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.dashboard_repository import IDashboardRepository
from app.models.adherent import Adherent
from app.models.demande_essai import DemandeEssai, StatutDemande
from app.models.evenement import Evenement


class DashboardRepository(IDashboardRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def compter_adherents_actifs(self, depuis: datetime | None = None) -> int:
        statement = select(func.count()).select_from(Adherent).where(Adherent.is_actif.is_(True))
        if depuis is not None:
            statement = statement.where(Adherent.created_at >= depuis)
        return (await self._session.exec(statement)).one()

    async def repartition_adherents_actifs(self) -> dict[str, int]:
        statement = (
            select(Adherent.type_adherent, func.count())
            .where(Adherent.is_actif.is_(True))
            .group_by(Adherent.type_adherent)
        )
        return {type_adherent.value: n for type_adherent, n in (await self._session.exec(statement)).all()}

    async def compter_demandes_a_traiter(self) -> int:
        statement = (
            select(func.count()).select_from(DemandeEssai).where(DemandeEssai.statut == StatutDemande.A_TRAITER)
        )
        return (await self._session.exec(statement)).one()

    def _a_venir(self, aujourd_hui: date):
        return func.coalesce(Evenement.date_fin, Evenement.date_evenement) >= aujourd_hui

    async def compter_evenements_a_venir(self, aujourd_hui: date) -> int:
        statement = select(func.count()).select_from(Evenement).where(self._a_venir(aujourd_hui))
        return (await self._session.exec(statement)).one()

    async def prochain_evenement(self, aujourd_hui: date) -> Evenement | None:
        statement = (
            select(Evenement)
            .where(self._a_venir(aujourd_hui))
            .order_by(Evenement.date_evenement, Evenement.heure_debut)
            .limit(1)
        )
        return (await self._session.exec(statement)).first()
