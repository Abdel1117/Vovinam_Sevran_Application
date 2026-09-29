import { API_URL } from "@/lib/auth";
import { extractErrorMessage } from "@/lib/apiError";
import type { AuthorizedFetch } from "@/lib/api/images";
import type { CoursEssai, StatutDemande } from "@/lib/data";

export type DemandeEssai = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  cours: CoursEssai;
  message: string | null;
  statut: StatutDemande;
  /** YYYY-MM-DD */
  date_essai: string | null;
  note_interne: string | null;
  /** ISO 8601 */
  created_at: string;
  updated_at: string;
};

export type DemandePubliqueInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  cours: CoursEssai;
  message: string;
  consentement: boolean;
  site_web: string;
};

export type DemandeAdminInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  cours: CoursEssai;
  message: string;
  statut: StatutDemande;
  date_essai: string;
  note_interne: string;
};

export class DemandeApiError extends Error {}

function vide(valeur: string): string | null {
  return valeur.trim() || null;
}

/** Formulaire de contact du site (sans authentification). */
export async function envoyerDemandeEssai(input: DemandePubliqueInput): Promise<void> {
  const response = await fetch(`${API_URL}/demandes-essai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, telephone: vide(input.telephone), message: vide(input.message) }),
  });
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "L'envoi a échoué, réessayez dans un instant."));
  }
}

function toBody(input: DemandeAdminInput): string {
  return JSON.stringify({
    ...input,
    telephone: vide(input.telephone),
    message: vide(input.message),
    date_essai: vide(input.date_essai),
    note_interne: vide(input.note_interne),
  });
}

export async function listDemandes(
  fetcher: AuthorizedFetch,
  options: { statut?: StatutDemande; limit?: number } = {},
): Promise<DemandeEssai[]> {
  const params = new URLSearchParams();
  if (options.statut) params.set("statut", options.statut);
  if (options.limit) params.set("limit", String(options.limit));
  const query = params.toString() ? `?${params}` : "";
  const response = await fetcher(`/demandes-essai${query}`);
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "Impossible de charger les demandes."));
  }
  return response.json();
}

export async function getDemande(fetcher: AuthorizedFetch, id: string): Promise<DemandeEssai | undefined> {
  const response = await fetcher(`/demandes-essai/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "Impossible de charger la demande."));
  }
  return response.json();
}

export async function createDemande(fetcher: AuthorizedFetch, input: DemandeAdminInput): Promise<DemandeEssai> {
  const response = await fetcher("/demandes-essai/manuelle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: toBody(input),
  });
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "Impossible d'enregistrer la demande."));
  }
  return response.json();
}

export async function updateDemande(
  fetcher: AuthorizedFetch,
  id: string,
  input: DemandeAdminInput,
): Promise<DemandeEssai> {
  const response = await fetcher(`/demandes-essai/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: toBody(input),
  });
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "Impossible d'enregistrer la demande."));
  }
  return response.json();
}

export async function deleteDemande(fetcher: AuthorizedFetch, id: string): Promise<void> {
  const response = await fetcher(`/demandes-essai/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new DemandeApiError(await extractErrorMessage(response, "Impossible de supprimer la demande."));
  }
}
