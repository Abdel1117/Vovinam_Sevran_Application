"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteImage, listImages } from "@/lib/api/images";
import type { PhotoGalerie } from "@/lib/data";

export function useImages() {
  const { authorizedFetch } = useAuth();
  const [images, setImages] = useState<PhotoGalerie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setImages(await listImages(authorizedFetch));
    } catch {
      setError("Impossible de charger les images.");
    } finally {
      setIsLoading(false);
    }
  }, [authorizedFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeImage = useCallback(
    async (id: string) => {
      await deleteImage(authorizedFetch, id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    },
    [authorizedFetch],
  );

  return { images, isLoading, error, refresh, removeImage };
}
