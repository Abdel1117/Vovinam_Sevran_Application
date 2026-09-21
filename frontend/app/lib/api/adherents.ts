import type { Adherent } from "@/lib/data";
import { extractErrorMessage } from "@/lib/apiError";

export type AdherentInput = Omit<Adherent, "id">;
export type AuthorizedFetch = (path: string, init?: RequestInit) => Promise<Response>;

export class AdherentApiError extends Error {}

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function listAdherents(fetcher: AuthorizedFetch): Promise<Adherent[]> {
  const response = await fetcher("/adherents");
  if (!response.ok) {
    throw new AdherentApiError(await extractErrorMessage(response, "Impossible de charger les adhérents."));
  }
  return response.json();
}

export async function getAdherent(fetcher: AuthorizedFetch, id: string): Promise<Adherent | undefined> {
  const response = await fetcher(`/adherents/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new AdherentApiError(await extractErrorMessage(response, "Impossible de charger l'adhérent."));
  }
  return response.json();
}

export async function createAdherent(fetcher: AuthorizedFetch, input: AdherentInput): Promise<Adherent> {
  const response = await fetcher("/adherents", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new AdherentApiError(await extractErrorMessage(response, "Impossible de créer l'adhérent."));
  }
  return response.json();
}

export async function updateAdherent(
  fetcher: AuthorizedFetch,
  id: string,
  input: AdherentInput,
): Promise<Adherent> {
  const response = await fetcher(`/adherents/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new AdherentApiError(await extractErrorMessage(response, "Impossible d'enregistrer l'adhérent."));
  }
  return response.json();
}

export async function deleteAdherent(fetcher: AuthorizedFetch, id: string): Promise<void> {
  const response = await fetcher(`/adherents/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new AdherentApiError(await extractErrorMessage(response, "Impossible de supprimer l'adhérent."));
  }
}
