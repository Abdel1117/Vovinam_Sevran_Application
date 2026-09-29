import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { API_URL } from "@/lib/auth";
import { extractErrorMessage } from "@/lib/apiError";
import type { AuthorizedFetch } from "@/lib/api/images";
import type { TypeEvenement } from "@/lib/data";

export type EvenementPublic = {
  id: string;
  titre: string;
  type: TypeEvenement;
  /** YYYY-MM-DD */
  date_debut: string;
  date_fin: string | null;
  /** HH:MM */
  heure_debut: string;
  heure_fin: string | null;
  lieu: string | null;
  adresse: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
};

export type EvenementInput = Omit<EvenementPublic, "id" | "lieu"> & { lieu: string };

export class EvenementApiError extends Error {}

// Côté serveur Next (dans Docker), le backend n'est pas joignable via localhost.
const BASE_URL = process.env.API_INTERNAL_URL ?? API_URL;

const MOIS_COURTS = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEP", "OCT", "NOV", "DÉC"];

export function parseDateIso(valeur: string): Date {
  return new Date(`${valeur}T00:00:00`);
}

/** Pastille calendrier : « 14 / SEP », « 14–16 / SEP » ou « 30–2 / SEP–OCT ». */
export function pastilleDate(e: Pick<EvenementPublic, "date_debut" | "date_fin">): { jour: string; mois: string } {
  const debut = parseDateIso(e.date_debut);
  const fin = e.date_fin ? parseDateIso(e.date_fin) : null;
  if (!fin) return { jour: String(debut.getDate()).padStart(2, "0"), mois: MOIS_COURTS[debut.getMonth()] };
  const memeMois = debut.getMonth() === fin.getMonth() && debut.getFullYear() === fin.getFullYear();
  return {
    jour: `${debut.getDate()}–${fin.getDate()}`,
    mois: memeMois ? MOIS_COURTS[debut.getMonth()] : `${MOIS_COURTS[debut.getMonth()]}–${MOIS_COURTS[fin.getMonth()]}`,
  };
}

/** « samedi 14 septembre 2026 » ou « du 14 au 16 septembre 2026 ». */
export function dateLongue(e: Pick<EvenementPublic, "date_debut" | "date_fin">): string {
  const debut = parseDateIso(e.date_debut);
  if (!e.date_fin) return format(debut, "EEEE d MMMM yyyy", { locale: fr });
  const fin = parseDateIso(e.date_fin);
  const formatDebut = debut.getFullYear() !== fin.getFullYear() ? "d MMMM yyyy" : debut.getMonth() !== fin.getMonth() ? "d MMMM" : "d";
  return `du ${format(debut, formatDebut, { locale: fr })} au ${format(fin, "d MMMM yyyy", { locale: fr })}`;
}

/** « 09:00 — 17:00 » ou « 09:00 ». */
export function horaire(e: Pick<EvenementPublic, "heure_debut" | "heure_fin">): string {
  return e.heure_fin ? `${e.heure_debut} — ${e.heure_fin}` : e.heure_debut;
}

export function icsUrl(id: string): string {
  return `${API_URL}/evenements/${id}/ics`;
}

function toBody(input: EvenementInput): string {
  return JSON.stringify({
    ...input,
    date_fin: input.date_fin || null,
    heure_fin: input.heure_fin || null,
    adresse: input.adresse?.trim() || null,
    description: input.description?.trim() || null,
  });
}

export async function listEvenementsAVenir(limit?: number): Promise<EvenementPublic[]> {
  const query = limit ? `?limit=${limit}` : "";
  const response = await fetch(`${BASE_URL}/evenements${query}`, { cache: "no-store" });
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible de charger l'agenda."));
  }
  return response.json();
}

export async function listTousEvenements(fetcher: AuthorizedFetch): Promise<EvenementPublic[]> {
  const response = await fetcher("/evenements/tous");
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible de charger l'agenda."));
  }
  return response.json();
}

export async function getEvenement(fetcher: AuthorizedFetch, id: string): Promise<EvenementPublic | undefined> {
  const response = await fetcher(`/evenements/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible de charger l'événement."));
  }
  return response.json();
}

export async function createEvenement(fetcher: AuthorizedFetch, input: EvenementInput): Promise<EvenementPublic> {
  const response = await fetcher("/evenements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: toBody(input),
  });
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible de créer l'événement."));
  }
  return response.json();
}

export async function updateEvenement(
  fetcher: AuthorizedFetch,
  id: string,
  input: EvenementInput,
): Promise<EvenementPublic> {
  const response = await fetcher(`/evenements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: toBody(input),
  });
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible d'enregistrer l'événement."));
  }
  return response.json();
}

export async function deleteEvenement(fetcher: AuthorizedFetch, id: string): Promise<void> {
  const response = await fetcher(`/evenements/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new EvenementApiError(await extractErrorMessage(response, "Impossible de supprimer l'événement."));
  }
}
