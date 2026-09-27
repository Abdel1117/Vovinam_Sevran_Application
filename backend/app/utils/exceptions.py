class InvalidCredentialsError(Exception):
    """Raised when login credentials do not match an active user."""


class InvalidSessionError(Exception):
    """Raised when an access token is missing, expired or malformed."""


class LicenceDejaUtiliseeError(Exception):
    """Raised when creating/updating an adherent with a numero_licence already taken."""


class AdherentIntrouvableError(Exception):
    """Raised when an adherent id does not match any active record."""


class PhotoIntrouvableError(Exception):
    """Raised when a photo galerie id does not match any record."""


class FichierInvalideError(Exception):
    """Raised when an uploaded file fails content-type or size validation."""
