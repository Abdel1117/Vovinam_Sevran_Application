import uuid
from abc import ABC, abstractmethod

from app.models.photo_galerie import PhotoGalerie


class IPhotoGalerieRepository(ABC):
    @abstractmethod
    async def list(self) -> list[PhotoGalerie]: ...

    @abstractmethod
    async def get(self, photo_id: uuid.UUID | str) -> PhotoGalerie | None: ...

    @abstractmethod
    async def create(self, photo: PhotoGalerie) -> PhotoGalerie: ...

    @abstractmethod
    async def update(self, photo: PhotoGalerie) -> PhotoGalerie: ...

    @abstractmethod
    async def delete(self, photo_id: uuid.UUID | str) -> None: ...
