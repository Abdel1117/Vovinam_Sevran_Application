import { photos, type PhotoGalerie } from "@/lib/data";
import { createMockRepository } from "@/lib/mockRepository";

export type ImageInput = Omit<PhotoGalerie, "id">;

export class ImageApiError extends Error {}

const repository = createMockRepository<PhotoGalerie>("vovinam_images", photos);

function genererId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `gal-${Date.now()}`;
}

export async function listImages(): Promise<PhotoGalerie[]> {
  return repository.list();
}

export async function getImage(id: string): Promise<PhotoGalerie | undefined> {
  return repository.get(id);
}

export async function createImage(input: ImageInput): Promise<PhotoGalerie> {
  if (!input.url) {
    throw new ImageApiError("Une image doit être sélectionnée.");
  }
  return repository.create({ ...input, id: genererId() });
}

export async function updateImage(id: string, input: ImageInput): Promise<PhotoGalerie> {
  return repository.update(id, input);
}

export async function deleteImage(id: string): Promise<void> {
  return repository.remove(id);
}
