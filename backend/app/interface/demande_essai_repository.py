import uuid
from abc import ABC, abstractmethod

from app.models.demande_essai import DemandeEssai, StatutDemande


class IDemandeEssaiRepository(ABC):
    @abstractmethod
    async def list(self, statut: StatutDemande | None = None, limit: int | None = None) -> list[DemandeEssai]: ...

    @abstractmethod
    async def get(self, demande_id: uuid.UUID | str) -> DemandeEssai | None: ...

    @abstractmethod
    async def create(self, demande: DemandeEssai) -> DemandeEssai: ...

    @abstractmethod
    async def update(self, demande: DemandeEssai) -> DemandeEssai: ...

    @abstractmethod
    async def delete(self, demande: DemandeEssai) -> None: ...
