"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteEvenement, listTousEvenements, type EvenementPublic } from "@/lib/api/evenements";

export function useEvenements() {
  const { authorizedFetch } = useAuth();
  const [evenements, setEvenements] = useState<EvenementPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEvenements(await listTousEvenements(authorizedFetch));
    } catch {
      setError("Impossible de charger l'agenda.");
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeEvenement = useCallback(
    async (id: string) => {
      await deleteEvenement(authorizedFetch, id);
      setEvenements((prev) => prev.filter((e) => e.id !== id));
    },
    [authorizedFetch],
  );

  return { evenements, isLoading, error, refresh, removeEvenement };
}
