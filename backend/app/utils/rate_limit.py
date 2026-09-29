import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


class RateLimiter:
    """Limiteur en mémoire par adresse IP (suffisant pour un seul process uvicorn).

    Protège les formulaires publics contre l'envoi massif ; en cas de plusieurs
    workers, chaque worker a son propre compteur.
    """

    def __init__(self, max_requetes: int, fenetre_secondes: int) -> None:
        self._max = max_requetes
        self._fenetre = fenetre_secondes
        self._historique: dict[str, deque[float]] = defaultdict(deque)

    async def __call__(self, request: Request) -> None:
        # Derrière nginx, l'IP réelle est transmise dans X-Real-IP.
        ip = request.headers.get("x-real-ip") or (request.client.host if request.client else "inconnue")
        maintenant = time.monotonic()
        historique = self._historique[ip]
        while historique and maintenant - historique[0] > self._fenetre:
            historique.popleft()
        if len(historique) >= self._max:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Trop de demandes envoyées. Réessayez dans quelques minutes.",
            )
        historique.append(maintenant)
