"use client";

import { use } from "react";
import ImageForm from "@/components/ImageForm/ImageForm";
import Loader from "@/components/Loader/Loader";
import { useImageForm } from "@/hooks/useImageForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    previewUrl,
    setField,
    setFichier,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
  } = useImageForm(id);

  if (isLoadingInitial) {
    return <Loader className="min-h-[60vh] p-8" />;
  }

  return (
    <ImageForm
      mode="edit"
      values={values}
      previewUrl={previewUrl}
      setField={setField}
      setFichier={setFichier}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}
