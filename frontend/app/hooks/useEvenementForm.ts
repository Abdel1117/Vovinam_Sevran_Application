"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  EvenementApiError,
  createEvenement,
  getEvenement,
  updateEvenement,
  type EvenementInput,
} from "@/lib/api/evenements";
import type { AdresseSuggestion } from "@/lib/api/adresses";
import { contientUneLettre, estDateIsoValide, longueurEntre, longueurMax, requis } from "@/lib/validation";

export const TITRE_MIN = 3;
export const TITRE_MAX = 100;
export const LIEU_MIN = 3;
export const LIEU_MAX = 150;
export const DESCRIPTION_MAX = 600;
export const ADRESSE_MAX = 200;

const REGEX_HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type EvenementFormValues = {
  titre: string;
  type: EvenementInput["type"];
  date_debut: string;
  date_fin: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
};

const valeursVides: EvenementFormValues = {
  titre: "",
  type: "stage",
  date_debut: "",
  date_fin: "",
  heure_debut: "",
  heure_fin: "",
  lieu: "",
  adresse: "",
  latitude: null,
  longitude: null,
  description: "",
};

type EvenementFieldErrors = Partial<Record<keyof EvenementFormValues, string>>;

export function aujourdHuiIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function validerHeure(valeur: string, estRequise: boolean): string | undefined {
  if (!valeur) return estRequise ? "Ce champ est requis." : undefined;
  return REGEX_HEURE.test(valeur) ? undefined : "Heure invalide (HH:MM).";
}

function validate(values: EvenementFormValues, estCreation: boolean): EvenementFieldErrors {
  const titre = values.titre.trim().replace(/\s+/g, " ");
  const errors: EvenementFieldErrors = {
    titre:
      requis(titre, "Le titre est requis.") ??
      longueurEntre(titre, TITRE_MIN, TITRE_MAX) ??
      contientUneLettre(titre, "Le titre doit contenir au moins une lettre."),
    date_debut: requis(values.date_debut, "La date est requise.") ?? estDateIsoValide(values.date_debut),
    date_fin: values.date_fin ? estDateIsoValide(values.date_fin) : undefined,
    heure_debut: validerHeure(values.heure_debut, true),
    heure_fin: validerHeure(values.heure_fin, false),
    lieu: requis(values.lieu, "Le lieu est requis.") ?? longueurEntre(values.lieu, LIEU_MIN, LIEU_MAX),
    adresse: !values.adresse.trim()
      ? undefined
      : (longueurMax(values.adresse.trim(), ADRESSE_MAX) ??
        (values.latitude === null ? "Choisissez l'adresse dans la liste de suggestions." : undefined)),
    description: longueurMax(values.description.trim(), DESCRIPTION_MAX),
  };

  // Les dates ISO se comparent correctement en tant que chaînes.
  if (!errors.date_debut && estCreation && values.date_debut < aujourdHuiIso()) {
    errors.date_debut = "L'événement ne peut pas être dans le passé.";
  }
  const plusieursJours = Boolean(values.date_fin) && values.date_fin !== values.date_debut;
  if (!errors.date_fin && plusieursJours && values.date_fin < values.date_debut) {
    errors.date_fin = "La date de fin doit être après la date de début.";
  }
  if (!errors.heure_fin && values.heure_fin && !plusieursJours && values.heure_fin <= values.heure_debut) {
    errors.heure_fin = "L'heure de fin doit être après l'heure de début.";
  }

  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof EvenementFieldErrors] === undefined) delete errors[key as keyof EvenementFieldErrors];
  });
  return errors;
}

export function useEvenementForm(id?: string) {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [values, setValues] = useState<EvenementFormValues>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EvenementFieldErrors>({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const evenement = await getEvenement(authorizedFetch, id);
        if (cancelled) return;
        if (evenement) {
          setValues({
            titre: evenement.titre,
            type: evenement.type,
            date_debut: evenement.date_debut,
            date_fin: evenement.date_fin ?? "",
            heure_debut: evenement.heure_debut,
            heure_fin: evenement.heure_fin ?? "",
            lieu: evenement.lieu ?? "",
            adresse: evenement.adresse ?? "",
            latitude: evenement.latitude,
            longitude: evenement.longitude,
            description: evenement.description ?? "",
          });
        } else {
          setError("Événement introuvable.");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof EvenementApiError ? err.message : "Une erreur est survenue.");
      } finally {
        if (!cancelled) setIsLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, authorizedFetch]);

  const setField = useCallback(
    <K extends keyof EvenementFormValues>(field: K, value: EvenementFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  /** Saisie manuelle : l'adresse n'est plus vérifiée tant qu'une suggestion n'est pas choisie. */
  const setAdresseTexte = useCallback(
    (texte: string) => {
      setField("adresse", texte);
      setField("latitude", null);
      setField("longitude", null);
    },
    [setField],
  );

  const choisirAdresse = useCallback(
    (suggestion: AdresseSuggestion) => {
      setField("adresse", suggestion.label);
      setField("latitude", suggestion.latitude);
      setField("longitude", suggestion.longitude);
    },
    [setField],
  );

  const submit = useCallback(async () => {
    const errors = validate(values, !id);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setError(null);
    try {
      const input: EvenementInput = {
        titre: values.titre.trim().replace(/\s+/g, " "),
        type: values.type,
        date_debut: values.date_debut,
        date_fin: values.date_fin && values.date_fin !== values.date_debut ? values.date_fin : null,
        heure_debut: values.heure_debut,
        heure_fin: values.heure_fin || null,
        lieu: values.lieu.trim().replace(/\s+/g, " "),
        adresse: values.adresse.trim() || null,
        latitude: values.adresse.trim() ? values.latitude : null,
        longitude: values.adresse.trim() ? values.longitude : null,
        description: values.description.trim() || null,
      };
      const record = id
        ? await updateEvenement(authorizedFetch, id, input)
        : await createEvenement(authorizedFetch, input);
      router.push("/admin/agenda");
      return record;
    } catch (err) {
      setError(err instanceof EvenementApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, router, authorizedFetch]);

  return { values, setField, setAdresseTexte, choisirAdresse, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
