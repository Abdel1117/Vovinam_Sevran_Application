from fastapi import APIRouter
from app.controllers.adherent_controller import router as adherent_router
from app.controllers.auth_controller import router as auth_router
from app.controllers.health_controller import router as health_check_router


api_router = APIRouter()

api_router.include_router(health_check_router)
api_router.include_router(auth_router)
api_router.include_router(adherent_router)