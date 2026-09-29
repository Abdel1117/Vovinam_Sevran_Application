"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteDemande, listDemandes, type DemandeEssai } from "@/lib/api/demandesEssai";

export function useDemandes() {
  const { authorizedFetch } = useAuth();
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDemandes(await listDemandes(authorizedFetch));
    } catch {
      setError("Impossible de charger les demandes.");
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeDemande = useCallback(
    async (id: string) => {
      await deleteDemande(authorizedFetch, id);
      setDemandes((prev) => prev.filter((d) => d.id !== id));
    },
    [authorizedFetch],
  );

  return { demandes, isLoading, error, refresh, removeDemande };
}
