"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteImage, listImages } from "@/lib/api/images";
import type { PhotoGalerie } from "@/lib/data";

export function useImages() {
  const [images, setImages] = useState<PhotoGalerie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setImages(await listImages());
    } catch {
      setError("Impossible de charger les images.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeImage = useCallback(async (id: string) => {
    await deleteImage(id);
    setImages((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { images, isLoading, error, refresh, removeImage };
}
