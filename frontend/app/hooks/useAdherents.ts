"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteAdherent, listAdherents } from "@/lib/api/adherents";
import type { Adherent } from "@/lib/data";

export function useAdherents() {
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAdherents(await listAdherents());
    } catch {
      setError("Impossible de charger les adhérents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeAdherent = useCallback(async (id: string) => {
    await deleteAdherent(id);
    setAdherents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { adherents, isLoading, error, refresh, removeAdherent };
}
