from fastapi import APIRouter, Depends

from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import DashboardService
from app.utils.dependencies import get_dashboard_service, require_admin

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(require_admin)])


@router.get("/stats", response_model=DashboardStats)
async def stats(service: DashboardService = Depends(get_dashboard_service)) -> DashboardStats:
    return await service.stats()
