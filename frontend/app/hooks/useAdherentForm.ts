"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdherentApiError,
  createAdherent,
  getAdherent,
  updateAdherent,
  type AdherentInput,
} from "@/lib/api/adherents";
import type { ContactUrgence } from "@/lib/data";
import { estDateFrValide, estEmailValide, estTelephoneValide, requis } from "@/lib/validation";

const valeursVides: AdherentInput = {
  nom: "",
  prenom: "",
  licence: "",
  grade: "",
  couleur: "#1851D9",
  naissance: "",
  categorie: "Adultes",
  statut: "En attente",
  email: "",
  telephone: "",
  adresse: "",
  certificat: "Manquant",
  assurance: "Incluse",
  contactsUrgence: [],
};

type AdherentFieldErrors = Partial<Record<keyof AdherentInput, string>>;
type ContactFieldErrors = Partial<Record<keyof ContactUrgence, string>>;

function sansVide<T extends Record<string, string | undefined>>(obj: T): T {
  const copie = { ...obj };
  (Object.keys(copie) as (keyof T)[]).forEach((cle) => {
    if (copie[cle] === undefined) delete copie[cle];
  });
  return copie;
}

function validate(values: AdherentInput): { erreurs: AdherentFieldErrors; erreursContacts: ContactFieldErrors[] } {
  const erreurs: AdherentFieldErrors = {};
  erreurs.nom = requis(values.nom);
  erreurs.prenom = requis(values.prenom);
  erreurs.licence = requis(values.licence);
  erreurs.grade = requis(values.grade);
  erreurs.naissance = requis(values.naissance) ?? estDateFrValide(values.naissance);
  erreurs.telephone = requis(values.telephone) ?? estTelephoneValide(values.telephone);
  erreurs.email = requis(values.email) ?? estEmailValide(values.email);
  erreurs.adresse = requis(values.adresse);
  erreurs.assurance = requis(values.assurance);

  const erreursContacts = values.contactsUrgence.map((contact) => {
    if (!contact.nom.trim() && !contact.telephone.trim()) return {};
    return sansVide<ContactFieldErrors>({
      nom: requis(contact.nom),
      telephone: requis(contact.telephone) ?? estTelephoneValide(contact.telephone),
    });
  });

  const auMoinsUnContactValide = values.contactsUrgence.some(
    (contact, i) => contact.nom.trim() && contact.telephone.trim() && Object.keys(erreursContacts[i]).length === 0,
  );
  if (values.categorie === "Adultes" && !auMoinsUnContactValide) {
    erreurs.contactsUrgence = "Au moins un contact d'urgence est requis pour un adulte.";
  }

  return { erreurs: sansVide(erreurs), erreursContacts };
}

export function useAdherentForm(id?: string) {
  const router = useRouter();
  const [values, setValues] = useState<AdherentInput>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AdherentFieldErrors>({});
  const [contactErrors, setContactErrors] = useState<ContactFieldErrors[]>([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const adherent = await getAdherent(id);
      if (cancelled) return;
      if (adherent) {
        setValues({
          nom: adherent.nom,
          prenom: adherent.prenom,
          licence: adherent.licence,
          grade: adherent.grade,
          couleur: adherent.couleur,
          naissance: adherent.naissance,
          categorie: adherent.categorie,
          statut: adherent.statut,
          email: adherent.email,
          telephone: adherent.telephone,
          adresse: adherent.adresse,
          certificat: adherent.certificat,
          assurance: adherent.assurance,
          contactsUrgence: adherent.contactsUrgence ?? [],
        });
      } else {
        setError("Adhérent introuvable.");
      }
      setIsLoadingInitial(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const setField = useCallback(
    <K extends keyof AdherentInput>(field: K, value: AdherentInput[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const ajouterContactUrgence = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      contactsUrgence: [...prev.contactsUrgence, { nom: "", telephone: "", lien: "" }],
    }));
    setContactErrors((prev) => [...prev, {}]);
  }, []);

  const modifierContactUrgence = useCallback((index: number, champ: keyof ContactUrgence, valeur: string) => {
    setValues((prev) => ({
      ...prev,
      contactsUrgence: prev.contactsUrgence.map((c, i) => (i === index ? { ...c, [champ]: valeur } : c)),
    }));
    setContactErrors((prev) =>
      prev.map((e, i) => (i === index && e[champ] ? { ...e, [champ]: undefined } : e)),
    );
    setFieldErrors((prev) => (prev.contactsUrgence ? { ...prev, contactsUrgence: undefined } : prev));
  }, []);

  const supprimerContactUrgence = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      contactsUrgence: prev.contactsUrgence.filter((_, i) => i !== index),
    }));
    setContactErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const submit = useCallback(async () => {
    const { erreurs, erreursContacts } = validate(values);
    const getErrorsInFormContact = erreursContacts.some((e) => Object.keys(e).length > 0);
    if (Object.keys(erreurs).length > 0 || getErrorsInFormContact) {
      setFieldErrors(erreurs);
      setContactErrors(erreursContacts);
      return null;
    }
    setFieldErrors({});
    setContactErrors([]);
    setIsSubmitting(true);
    setError(null);
    try {
      const record = id ? await updateAdherent(id, values) : await createAdherent(values);
      router.push("/admin/adherents");
      return record;
    } catch (err) {
      setError(err instanceof AdherentApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, router]);

  return {
    values,
    setField,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
    contactErrors,
    ajouterContactUrgence,
    modifierContactUrgence,
    supprimerContactUrgence,
  };
}
