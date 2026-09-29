"use client";

import { use } from "react";
import ArticleForm from "@/components/ArticleForm/ArticleForm";
import { useArticleForm } from "@/hooks/useArticleForm";

type Params = { slug: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const { values, setField, setImage, submit, isSubmitting, isLoadingInitial, error, fieldErrors } = useArticleForm(slug);

  if (isLoadingInitial) {
    return <div className="p-8 text-encre-30">Chargement…</div>;
  }

  return (
    <ArticleForm
      mode="edit"
      slug={slug}
      values={values}
      setField={setField}
      setImage={setImage}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
