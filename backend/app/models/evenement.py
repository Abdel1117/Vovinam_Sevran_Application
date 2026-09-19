import uuid
from datetime import date, datetime, time, timezone
from enum import Enum

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel


class TypeEvenement(str, Enum):
    STAGE = "stage"
    COMPETITION = "competition"
    PASSAGE_DE_GRADES = "passage_de_grades"
    DEMONSTRATION = "demonstration"


class Evenement(SQLModel, table=True):
    __tablename__ = "evenements"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    titre: str = Field(nullable=False)
    date_evenement: date = Field(nullable=False)
    heure_debut: time = Field(nullable=False)
    heure_fin: time | None = Field(default=None)
    type_evenement: TypeEvenement = Field(
        default=TypeEvenement.STAGE,
        sa_column=Column(
            SAEnum(TypeEvenement, name="typeevenement", values_callable=lambda enum: [e.value for e in enum]),
            nullable=False,
        ),
    )
    lieu: str | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
