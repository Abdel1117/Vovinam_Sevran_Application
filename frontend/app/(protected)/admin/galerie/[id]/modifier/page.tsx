"use client";

import { use } from "react";
import ImageForm from "@/components/ImageForm/ImageForm";
import { useImageForm } from "@/hooks/useImageForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const { values, setField, submit, isSubmitting, isLoadingInitial, error, fieldErrors } = useImageForm(id);

  if (isLoadingInitial) {
    return <div className="p-8 text-encre-30">Chargement…</div>;
  }

  return (
    <ImageForm
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
