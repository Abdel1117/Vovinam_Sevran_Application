from abc import ABC, abstractmethod
from datetime import date, datetime

from app.models.evenement import Evenement


class IDashboardRepository(ABC):
    @abstractmethod
    async def compter_adherents_actifs(self, depuis: datetime | None = None) -> int: ...

    @abstractmethod
    async def repartition_adherents_actifs(self) -> dict[str, int]: ...

    @abstractmethod
    async def compter_demandes_a_traiter(self) -> int: ...

    @abstractmethod
    async def compter_evenements_a_venir(self, aujourd_hui: date) -> int: ...

    @abstractmethod
    async def prochain_evenement(self, aujourd_hui: date) -> Evenement | None: ...
