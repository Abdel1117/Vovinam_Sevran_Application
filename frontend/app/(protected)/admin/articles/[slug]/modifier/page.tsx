"use client";

import { use } from "react";
import ArticleForm from "@/components/ArticleForm/ArticleForm";
import Loader from "@/components/Loader/Loader";
import { useArticleForm } from "@/hooks/useArticleForm";

type Params = { slug: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const { values, setField, setImage, submit, isSubmitting, isLoadingInitial, error, fieldErrors } = useArticleForm(slug);

  if (isLoadingInitial) {
    return <Loader className="min-h-[60vh] p-8" />;
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
