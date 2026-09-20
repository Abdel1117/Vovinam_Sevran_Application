"use client";

import { use } from "react";
import ArticleForm from "@/components/ArticleForm/ArticleForm";
import { useArticleForm } from "@/hooks/useArticleForm";

type Params = { slug: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const { values, setField, submit, isSubmitting, isLoadingInitial, error, fieldErrors } = useArticleForm(slug);

  if (isLoadingInitial) {
    return <div className="p-8 text-encre-30">Chargement…</div>;
  }

  return (
    <ArticleForm
      mode="edit"
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
