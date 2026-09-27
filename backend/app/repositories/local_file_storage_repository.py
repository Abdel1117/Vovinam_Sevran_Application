import asyncio
from pathlib import Path

from app.interface.file_storage_repository import IFileStorageRepository


class LocalFileStorageRepository(IFileStorageRepository):
    def __init__(self, base_dir: str, base_url: str) -> None:
        self._base_dir = Path(base_dir)
        self._base_url = base_url.rstrip("/")

    def _resolve(self, relative_path: str) -> Path:
        return self._base_dir / relative_path

    async def save(self, subdir: str, filename: str, content: bytes) -> str:
        relative_path = f"{subdir}/{filename}"

        def _write() -> None:
            target = self._resolve(relative_path)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)

        await asyncio.to_thread(_write)
        return relative_path

    async def delete(self, relative_path: str) -> None:
        def _delete() -> None:
            target = self._resolve(relative_path)
            target.unlink(missing_ok=True)

        await asyncio.to_thread(_delete)

    def url_for(self, relative_path: str) -> str:
        return f"{self._base_url}/{relative_path}"
