"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteAdherent, listAdherents } from "@/lib/api/adherents";
import type { Adherent } from "@/lib/data";

export function useAdherents() {
  const { authorizedFetch } = useAuth();
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAdherents(await listAdherents(authorizedFetch));
    } catch {
      setError("Impossible de charger les adhérents.");
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeAdherent = useCallback(
    async (id: string) => {
      await deleteAdherent(authorizedFetch, id);
      setAdherents((prev) => prev.filter((a) => a.id !== id));
    },
    [authorizedFetch],
  );

  return { adherents, isLoading, error, refresh, removeAdherent };
}
