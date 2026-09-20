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
  dateGrade: "",
  certificat: "Manquant",
  assurance: "Incluse",
};

export function useAdherentForm(id?: string) {
  const router = useRouter();
  const [values, setValues] = useState<AdherentInput>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          dateGrade: adherent.dateGrade,
          certificat: adherent.certificat,
          assurance: adherent.assurance,
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
    },
    [],
  );

  const submit = useCallback(async () => {
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

  return { values, setField, submit, isSubmitting, isLoadingInitial, error };
}
