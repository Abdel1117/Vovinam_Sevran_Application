from datetime import date
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

CategorieAdherent = Literal["Enfants", "Adolescents", "Adultes"]
StatutAdherent = Literal["À jour", "En attente"]
CertificatAdherent = Literal["Valide", "Manquant"]
AssuranceAdherent = Literal["Assuré", "Pas assuré"]


class ContactUrgencePayload(BaseModel):
    nom: str
    telephone: str
    lien: str = ""


class AdherentBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    nom: str
    prenom: str
    naissance: date
    licence: str
    grade: str
    couleur: str
    categorie: CategorieAdherent
    statut: StatutAdherent
    email: str
    telephone: str
    adresse: str
    code_postal: str
    certificat: CertificatAdherent
    assurance: AssuranceAdherent
    contacts_urgence: list[ContactUrgencePayload] = Field(default_factory=list, alias="contactsUrgence")


class AdherentCreate(AdherentBase):
    pass


class AdherentUpdate(AdherentBase):
    pass


class AdherentPublic(AdherentBase):
    id: UUID
