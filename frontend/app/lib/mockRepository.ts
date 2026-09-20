export type Identifiable = { id: string };

const NETWORK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMockRepository<T extends Identifiable>(storageKey: string, seed: T[]) {
  function readAll(): T[] {
    if (typeof window === "undefined") return seed;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return seed;
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return seed;
    }
  }

  function writeAll(items: T[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }

  async function list(): Promise<T[]> {
    await delay(NETWORK_DELAY_MS);
    return readAll();
  }

  async function get(id: string): Promise<T | undefined> {
    await delay(NETWORK_DELAY_MS);
    return readAll().find((item) => item.id === id);
  }

  async function create(item: T): Promise<T> {
    await delay(NETWORK_DELAY_MS);
    const items = readAll();
    items.push(item);
    writeAll(items);
    return item;
  }

  async function update(id: string, patch: Partial<T>): Promise<T> {
    await delay(NETWORK_DELAY_MS);
    const items = readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Aucun élément avec l'id "${id}" dans "${storageKey}".`);
    }
    const updated = { ...items[index], ...patch };
    items[index] = updated;
    writeAll(items);
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await delay(NETWORK_DELAY_MS);
    const items = readAll();
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) {
      throw new Error(`Aucun élément avec l'id "${id}" dans "${storageKey}".`);
    }
    writeAll(next);
  }

  return { list, get, create, update, remove };
}
