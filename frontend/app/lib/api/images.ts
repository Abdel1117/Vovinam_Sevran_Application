import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { API_URL } from "@/lib/auth";
import type { PhotoGalerie } from "@/lib/data";
import { extractErrorMessage } from "@/lib/apiError";

export type ImageInput = {
  titre: string;
  categorie: string;
  date: string;
  fichier: File | null;
};

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGES_PAR_ENVOI = 10;

export type AuthorizedFetch = (path: string, init?: RequestInit) => Promise<Response>;

export class ImageApiError extends Error {}

export function formatMonthYear(date: Date): string {
  const texte = format(date, "MMMM yyyy", { locale: fr });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function parseMonthYear(valeur: string): Date | null {
  if (!valeur) return null;
  const date = parse(valeur.toLowerCase(), "MMMM yyyy", new Date(), { locale: fr });
  return Number.isNaN(date.getTime()) ? null : date;
}

function toFormData(input: ImageInput): FormData {
  const formData = new FormData();
  formData.append("titre", input.titre);
  formData.append("categorie", input.categorie);
  formData.append("date", input.date);
  if (input.fichier) formData.append("fichier", input.fichier);
  return formData;
}

function absolutise(url: string): string {
  return url.startsWith("/") ? `${API_URL}${url}` : url;
}

function withAbsoluteUrl(photo: PhotoGalerie): PhotoGalerie {
  return { ...photo, url: absolutise(photo.url), vignette: absolutise(photo.vignette) };
}

export async function listImages(fetcher: AuthorizedFetch): Promise<PhotoGalerie[]> {
  const response = await fetcher("/galerie");
  if (!response.ok) {
    throw new ImageApiError(await extractErrorMessage(response, "Impossible de charger les images."));
  }
  const photos: PhotoGalerie[] = await response.json();
  return photos.map(withAbsoluteUrl);
}

export async function listPublicImages(): Promise<PhotoGalerie[]> {
  return listImages((path, init) => fetch(`${API_URL}${path}`, init));
}

export async function getImage(fetcher: AuthorizedFetch, id: string): Promise<PhotoGalerie | undefined> {
  const response = await fetcher(`/galerie/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new ImageApiError(await extractErrorMessage(response, "Impossible de charger l'image."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function createImage(fetcher: AuthorizedFetch, input: ImageInput): Promise<PhotoGalerie> {
  if (!input.fichier) {
    throw new ImageApiError("Une image doit être sélectionnée.");
  }
  const response = await fetcher("/galerie", { method: "POST", body: toFormData(input) });
  if (!response.ok) {
    throw new ImageApiError(await extractErrorMessage(response, "Impossible de créer l'image."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function updateImage(fetcher: AuthorizedFetch, id: string, input: ImageInput): Promise<PhotoGalerie> {
  const response = await fetcher(`/galerie/${id}`, { method: "PUT", body: toFormData(input) });
  if (!response.ok) {
    throw new ImageApiError(await extractErrorMessage(response, "Impossible d'enregistrer l'image."));
  }
  return withAbsoluteUrl(await response.json());
}

export async function deleteImage(fetcher: AuthorizedFetch, id: string): Promise<void> {
  const response = await fetcher(`/galerie/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new ImageApiError(await extractErrorMessage(response, "Impossible de supprimer l'image."));
  }
}
