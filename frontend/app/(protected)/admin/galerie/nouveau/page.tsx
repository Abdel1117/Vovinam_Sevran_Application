"use client";

import ImageBatchForm from "@/components/ImageBatchForm/ImageBatchForm";
import { useImageBatchForm } from "@/hooks/useImageBatchForm";

export default function Page() {
  const {
    files,
    addFiles,
    deleteFile,
    editFile,
    submit,
    isSubmitting,
    progress,
    error,
    errorByFile,
  } = useImageBatchForm();

  return (
    <ImageBatchForm
      files={files}
      addFiles={addFiles}
      deleteFile={deleteFile}
      editFile={editFile}
      onSubmit={submit}
      isSubmitting={isSubmitting}
      progress={progress}
      error={error}
      errorByFile={errorByFile}
    />
  );
}
