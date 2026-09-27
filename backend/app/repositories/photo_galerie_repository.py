import uuid

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.photo_galerie_repository import IPhotoGalerieRepository
from app.models.photo_galerie import PhotoGalerie


class PhotoGalerieRepository(IPhotoGalerieRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list(self) -> list[PhotoGalerie]:
        statement = select(PhotoGalerie).order_by(PhotoGalerie.created_at.desc())
        result = await self._session.exec(statement)
        return list(result.all())

    async def get(self, photo_id: uuid.UUID | str) -> PhotoGalerie | None:
        return await self._session.get(PhotoGalerie, photo_id)

    async def create(self, photo: PhotoGalerie) -> PhotoGalerie:
        self._session.add(photo)
        await self._session.commit()
        await self._session.refresh(photo)
        return photo

    async def update(self, photo: PhotoGalerie) -> PhotoGalerie:
        self._session.add(photo)
        await self._session.commit()
        await self._session.refresh(photo)
        return photo

    async def delete(self, photo_id: uuid.UUID | str) -> None:
        photo = await self._session.get(PhotoGalerie, photo_id)
        if photo is not None:
            await self._session.delete(photo)
            await self._session.commit()
