"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DemandeApiError,
  createDemande,
  getDemande,
  updateDemande,
  type DemandeAdminInput,
  type DemandeEssai,
} from "@/lib/api/demandesEssai";
import { estDateIsoValide, estEmailValide, estTelephoneValide, longueurMax, requis } from "@/lib/validation";

export const MESSAGE_MAX = 1000;
export const NOTE_MAX = 1000;
const REGEX_NOM = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;

export type DemandeFormValues = DemandeAdminInput;

const valeursVides: DemandeFormValues = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  cours: "adultes",
  message: "",
  statut: "a_traiter",
  date_essai: "",
  note_interne: "",
};

type DemandeFieldErrors = Partial<Record<keyof DemandeFormValues, string>>;

function validerNom(valeur: string, champ: string): string | undefined {
  const nom = valeur.trim().replace(/\s+/g, " ");
  return (
    requis(nom, `Le ${champ} est requis.`) ??
    (nom.length > 60 || !REGEX_NOM.test(nom) ? `Le ${champ} n'est pas valide.` : undefined)
  );
}

function validate(values: DemandeFormValues): DemandeFieldErrors {
  const errors: DemandeFieldErrors = {
    prenom: validerNom(values.prenom, "prénom"),
    nom: validerNom(values.nom, "nom"),
    email: requis(values.email, "L'email est requis.") ?? estEmailValide(values.email),
    telephone: values.telephone.trim() ? estTelephoneValide(values.telephone) : undefined,
    message: longueurMax(values.message.trim(), MESSAGE_MAX),
    note_interne: longueurMax(values.note_interne.trim(), NOTE_MAX),
    date_essai:
      values.statut === "essai_planifie" && !values.date_essai
        ? "Indiquez la date du cours d'essai."
        : values.date_essai
          ? estDateIsoValide(values.date_essai)
          : undefined,
  };
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof DemandeFieldErrors] === undefined) delete errors[key as keyof DemandeFieldErrors];
  });
  return errors;
}

export function useDemandeForm(id?: string) {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [values, setValues] = useState<DemandeFormValues>(valeursVides);
  const [demande, setDemande] = useState<DemandeEssai | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<DemandeFieldErrors>({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const d = await getDemande(authorizedFetch, id);
        if (cancelled) return;
        if (d) {
          setDemande(d);
          setValues({
            prenom: d.prenom,
            nom: d.nom,
            email: d.email,
            telephone: d.telephone ?? "",
            cours: d.cours,
            message: d.message ?? "",
            statut: d.statut,
            date_essai: d.date_essai ?? "",
            note_interne: d.note_interne ?? "",
          });
        } else {
          setError("Demande introuvable.");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof DemandeApiError ? err.message : "Une erreur est survenue.");
      } finally {
        if (!cancelled) setIsLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, authorizedFetch]);

  const setField = useCallback(
    <K extends keyof DemandeFormValues>(field: K, value: DemandeFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const submit = useCallback(async () => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setError(null);
    try {
      const input: DemandeAdminInput = {
        ...values,
        prenom: values.prenom.trim().replace(/\s+/g, " "),
        nom: values.nom.trim().replace(/\s+/g, " "),
        email: values.email.trim(),
      };
      const record = id
        ? await updateDemande(authorizedFetch, id, input)
        : await createDemande(authorizedFetch, input);
      router.push("/admin/cours-essai");
      return record;
    } catch (err) {
      setError(err instanceof DemandeApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, router, authorizedFetch]);

  return { values, demande, setField, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
