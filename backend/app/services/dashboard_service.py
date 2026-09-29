from datetime import datetime

from app.interface.dashboard_repository import IDashboardRepository
from app.models.adherent import TypeAdherent
from app.schemas.dashboard import DashboardStats, ProchainEvenement
from app.services.evenement_service import FUSEAU_CLUB, aujourd_hui

_MOIS_RENTREE = 9


def debut_saison(maintenant: datetime) -> datetime:
    """La saison sportive commence le 1er septembre."""
    annee = maintenant.year if maintenant.month >= _MOIS_RENTREE else maintenant.year - 1
    return datetime(annee, _MOIS_RENTREE, 1, tzinfo=FUSEAU_CLUB)


class DashboardService:
    def __init__(self, dashboard_repository: IDashboardRepository) -> None:
        self._repository = dashboard_repository

    async def stats(self) -> DashboardStats:
        jour = aujourd_hui()
        repartition = await self._repository.repartition_adherents_actifs()
        prochain = await self._repository.prochain_evenement(jour)
        return DashboardStats(
            adherents_actifs=await self._repository.compter_adherents_actifs(),
            adherents_nouveaux_saison=await self._repository.compter_adherents_actifs(
                depuis=debut_saison(datetime.now(FUSEAU_CLUB))
            ),
            # Toutes les catégories sont présentes, même à 0, pour un affichage stable.
            repartition_adherents={t.value: repartition.get(t.value, 0) for t in TypeAdherent},
            demandes_a_traiter=await self._repository.compter_demandes_a_traiter(),
            evenements_a_venir=await self._repository.compter_evenements_a_venir(jour),
            prochain_evenement=(
                ProchainEvenement(titre=prochain.titre, date_debut=prochain.date_evenement) if prochain else None
            ),
        )
