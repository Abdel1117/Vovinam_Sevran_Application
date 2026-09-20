"use client";

import ArticleForm from "@/components/ArticleForm/ArticleForm";
import { useArticleForm } from "@/hooks/useArticleForm";

export default function Page() {
  const { values, setField, submit, isSubmitting, error, fieldErrors } = useArticleForm();

  return (
    <ArticleForm
      mode="create"
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
