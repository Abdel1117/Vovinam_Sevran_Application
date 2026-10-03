"use client";

import { use } from "react";
import AdherentForm from "@/components/AdherentForm/AdherentForm";
import Loader from "@/components/Loader/Loader";
import { useAdherentForm } from "@/hooks/useAdherentForm";

type Params = { id: string };

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const {
    values,
    setField,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
    contactErrors,
    addContactUrgence,
    EditContactUrgence,
    deleteContactUrgence,
  } = useAdherentForm(id);

  if (isLoadingInitial) {
    return <Loader className="min-h-[60vh] p-8" />;
  }

  return (
    <AdherentForm
      mode="edit"
      values={values}
      setField={setField}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
      contactErrors={contactErrors}
      addContactUrgence={addContactUrgence}
      EditContactUrgence={EditContactUrgence}
      deleteContactUrgence={deleteContactUrgence}
    />
  );
}
