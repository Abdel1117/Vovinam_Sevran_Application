"use client";

import ImageForm from "@/components/ImageForm/ImageForm";
import { useImageForm } from "@/hooks/useImageForm";

export default function Page() {
  const { values, setField, submit, isSubmitting, error, fieldErrors } = useImageForm();

  return (
    <ImageForm
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
