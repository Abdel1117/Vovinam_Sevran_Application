from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from app.config import get_settings
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserPublic
from app.services.auth_service import AuthService
from app.utils.dependencies import REFRESH_TOKEN_COOKIE, get_auth_service, get_current_user
from app.utils.exceptions import InvalidCredentialsError

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=token,
        httponly=True,
        secure=settings.env != "development",
        samesite="lax",
        max_age=settings.jwt_refresh_expiration_days * 86400,
        path="/auth",
    )


def _token_response(access_token: str, user: User) -> TokenResponse:
    return TokenResponse(
        access_token=access_token,
        expires_in=settings.jwt_access_expiration_minutes * 60,
        user=UserPublic.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    try:
        access_token, refresh_token, user = await auth_service.authenticate(payload.email, payload.password)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    _set_refresh_cookie(response, refresh_token)
    return _token_response(access_token, user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_TOKEN_COOKIE),
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    access_token, new_refresh_token, user = await auth_service.refresh(refresh_token)
    _set_refresh_cookie(response, new_refresh_token)
    return _token_response(access_token, user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_TOKEN_COOKIE),
    auth_service: AuthService = Depends(get_auth_service),
) -> None:
    await auth_service.logout(refresh_token)
    response.delete_cookie(REFRESH_TOKEN_COOKIE, path="/auth")


@router.get("/me", response_model=UserPublic)
async def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
