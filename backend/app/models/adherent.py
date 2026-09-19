import uuid
from datetime import date, datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class TypeAdherent(str, Enum):
    ENFANT = "enfant"
    ADOLESCENT = "adolescent"
    ADULTE = "adulte"
    ENCADRANT = "encadrant"


class StatutCotisation(str, Enum):
    A_JOUR = "a_jour"
    EN_ATTENTE = "en_attente"


class CertificatMedical(str, Enum):
    VALIDE = "valide"
    MANQUANT = "manquant"


class Adherent(SQLModel, table=True):
    __tablename__ = "adherents"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nom: str = Field(nullable=False)
    prenom: str = Field(nullable=False)
    date_naissance: date = Field(nullable=False)
    numero_licence: str = Field(unique=True, index=True, nullable=False)
    grade: str = Field(nullable=False)
    couleur_ceinture: str | None = Field(default=None)
    date_obtention_grade: date | None = Field(default=None)
    type_adherent: TypeAdherent = Field(
        default=TypeAdherent.ADULTE,
        sa_column=Column(
            SAEnum(TypeAdherent, name="typeadherent", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    is_actif: bool = Field(default=True, nullable=False)
    telephone: str = Field(nullable=False)
    email: str | None = Field(default=None)
    adresse: str | None = Field(default=None)
    statut_cotisation: StatutCotisation = Field(
        default=StatutCotisation.EN_ATTENTE,
        sa_column=Column(
            SAEnum(StatutCotisation, name="statutcotisation", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    certificat_medical: CertificatMedical = Field(
        default=CertificatMedical.MANQUANT,
        sa_column=Column(
            SAEnum(CertificatMedical, name="certificatmedical", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    assurance_incluse: bool = Field(default=False, nullable=False)
    nom_secours: str = Field(nullable=False)
    prenom_secours: str = Field(nullable=False)
    telephone_secours: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
