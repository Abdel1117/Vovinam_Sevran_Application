"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteEnseignant, listEnseignants, type EnseignantPublic } from "@/lib/api/enseignants";

export function useEnseignants() {
  const { authorizedFetch } = useAuth();
  const [enseignants, setEnseignants] = useState<EnseignantPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEnseignants(await listEnseignants());
    } catch {
      setError("Impossible de charger les enseignants.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeEnseignant = useCallback(
    async (id: string) => {
      await deleteEnseignant(authorizedFetch, id);
      setEnseignants((prev) => prev.filter((e) => e.id !== id));
    },
    [authorizedFetch],
  );

  return { enseignants, isLoading, error, refresh, removeEnseignant };
}
