class InvalidCredentialsError(Exception):
    """Raised when login credentials do not match an active user."""


class InvalidSessionError(Exception):
    """Raised when an access token is missing, expired or malformed."""
