from datetime import date

from pydantic import BaseModel


class ProchainEvenement(BaseModel):
    titre: str
    date_debut: date


class DashboardStats(BaseModel):
    adherents_actifs: int
    adherents_nouveaux_saison: int
    repartition_adherents: dict[str, int]
    demandes_a_traiter: int
    evenements_a_venir: int
    prochain_evenement: ProchainEvenement | None
