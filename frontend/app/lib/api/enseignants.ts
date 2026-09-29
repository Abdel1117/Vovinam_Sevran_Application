import { API_URL } from "@/lib/auth";
import { extractErrorMessage } from "@/lib/apiError";
import { absolutise, type AuthorizedFetch } from "@/lib/api/images";

export type EnseignantPublic = {
  id: string;
  nom: string;
  grade: string;
  role: string;
  texte: string | null;
  photo: string | null;
  ordre: number;
};

export type EnseignantInput = {
  nom: string;
  grade: string;
  role: string;
  texte: string;
  /** Vide = placé en dernier à la création, inchangé en modification. */
  ordre: string;
  photo: File | null;
  supprimerPhoto: boolean;
};

export class EnseignantApiError extends Error {}

// Côté serveur Next (dans Docker), le backend n'est pas joignable via localhost.
const BASE_URL = process.env.API_INTERNAL_URL ?? API_URL;

function withAbsoluteUrl(e: EnseignantPublic): EnseignantPublic {
  return { ...e, photo: e.photo ? absolutise(e.photo) : null };
}

function toFormData(input: EnseignantInput): FormData {
  const formData = new FormData();
  formData.append("nom", input.nom);
  formData.append("grade", input.grade);
  formData.append("role", input.role);
  formData.append("texte", input.texte);
  if (input.ordre.trim()) formData.append("ordre", input.ordre.trim());
  if (input.photo) formData.append("photo", input.photo);
  else if (input.supprimerPhoto) formData.append("supprimer_photo", "true");
  return formData;
}

export async function listEnseignants(): Promise<EnseignantPublic[]> {
  const response = await fetch(`${BASE_URL}/enseignants`, { cache: "no-store" });
  if (!response.ok) {
    throw new EnseignantApiError(await extractErrorMessage(response, "Impossible de charger les enseignants."));
  }
  const enseignants: EnseignantPublic[] = await response.json();
  return enseignants.map(withAbsoluteUrl);
}

export async function getEnseignant(fetcher: AuthorizedFetch, id: string): Promise<EnseignantPublic | undefined> {
  const response = await fetcher(`/enseignants/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new EnseignantApiError(await extractErrorMessage(response, "Impossible de charger l'enseignant."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function createEnseignant(fetcher: AuthorizedFetch, input: EnseignantInput): Promise<EnseignantPublic> {
  const response = await fetcher("/enseignants", { method: "POST", body: toFormData(input) });
  if (!response.ok) {
    throw new EnseignantApiError(await extractErrorMessage(response, "Impossible d'ajouter l'enseignant."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function updateEnseignant(
  fetcher: AuthorizedFetch,
  id: string,
  input: EnseignantInput,
): Promise<EnseignantPublic> {
  const response = await fetcher(`/enseignants/${id}`, { method: "PUT", body: toFormData(input) });
  if (!response.ok) {
    throw new EnseignantApiError(await extractErrorMessage(response, "Impossible d'enregistrer l'enseignant."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function deleteEnseignant(fetcher: AuthorizedFetch, id: string): Promise<void> {
  const response = await fetcher(`/enseignants/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new EnseignantApiError(await extractErrorMessage(response, "Impossible de supprimer l'enseignant."));
  }
}
