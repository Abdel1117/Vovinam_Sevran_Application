import { adherents, type Adherent } from "@/lib/data";
import { createMockRepository } from "@/lib/mockRepository";

export type AdherentInput = Omit<Adherent, "id">;

export class AdherentApiError extends Error {}

const repository = createMockRepository<Adherent>("vovinam_adherents", adherents);

function genererId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `adh-${Date.now()}`;
}

export async function listAdherents(): Promise<Adherent[]> {
  return repository.list();
}

export async function getAdherent(id: string): Promise<Adherent | undefined> {
  return repository.get(id);
}

export async function createAdherent(input: AdherentInput): Promise<Adherent> {
  const items = await repository.list();
  if (items.some((a) => a.licence === input.licence)) {
    throw new AdherentApiError(`Un adhérent avec le n° de licence "${input.licence}" existe déjà.`);
  }
  return repository.create({ ...input, id: genererId() });
}

export async function updateAdherent(id: string, input: AdherentInput): Promise<Adherent> {
  return repository.update(id, input);
}

export async function deleteAdherent(id: string): Promise<void> {
  return repository.remove(id);
}
