"use client";
import { UploadDropzone } from "@/services/uploadthing/components/UploadThing";
import { useRouter } from "next/navigation";
import React from "react";

export default function DropzoneClient() {
  const router = useRouter();

  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={() => router.refresh()}
    />
  );
}
