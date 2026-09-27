from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.controllers import api_router
from app.utils.dependencies import REFRESH_TOKEN_COOKIE
from app.utils.exceptions import InvalidSessionError

settings = get_settings()

app = FastAPI(title="Vovinam Sevran API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)
app.mount(settings.uploads_public_path, StaticFiles(directory=settings.uploads_dir), name="uploads")


@app.exception_handler(InvalidSessionError)
async def invalid_session_handler(request: Request, exc: InvalidSessionError) -> JSONResponse:
    response = JSONResponse(status_code=401, content={"detail": str(exc)})
    response.delete_cookie(REFRESH_TOKEN_COOKIE, path="/auth")
    return response


app.include_router(api_router)
