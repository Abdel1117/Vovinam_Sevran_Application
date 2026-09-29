import uuid
from datetime import date, datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class CoursEssai(str, Enum):
    ENFANTS = "enfants"
    ADOLESCENTS = "adolescents"
    ADULTES = "adultes"


class StatutDemande(str, Enum):
    A_TRAITER = "a_traiter"
    CONTACTE = "contacte"
    ESSAI_PLANIFIE = "essai_planifie"
    INSCRIT = "inscrit"
    SANS_SUITE = "sans_suite"


class DemandeEssai(SQLModel, table=True):
    __tablename__ = "demandes_essai"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    prenom: str = Field(nullable=False)
    nom: str = Field(nullable=False)
    email: str = Field(nullable=False)
    telephone: str | None = Field(default=None)
    cours: CoursEssai = Field(
        sa_column=Column(
            SAEnum(CoursEssai, name="coursessai", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    message: str | None = Field(default=None)
    statut: StatutDemande = Field(
        default=StatutDemande.A_TRAITER,
        sa_column=Column(
            SAEnum(StatutDemande, name="statutdemande", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
            index=True,
        ),
    )
    date_essai: date | None = Field(default=None)
    note_interne: str | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
