"use client";
import { uploadFiles } from "@/lib/r2";
import { useState } from "react";

export function useUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(files: File[], folder: string) {
    try {
      setUploading(true);
      const urls = await uploadFiles(files, folder);
      return urls;
    } catch (error) {
      console.error("Uploading Images: ", error);
    } finally {
      setUploading(false);
    }
  }

  return {
    isUploading: uploading,
    upload,
  };
}
