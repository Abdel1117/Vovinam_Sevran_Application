"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteArticle, listArticles, type ArticleRecord } from "@/lib/api/articles";

export function useArticles() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setArticles(await listArticles());
    } catch {
      setError("Impossible de charger les articles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeArticle = useCallback(async (slug: string) => {
    await deleteArticle(slug);
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
  }, []);

  return { articles, isLoading, error, refresh, removeArticle };
}
