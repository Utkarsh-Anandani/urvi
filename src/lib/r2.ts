import { getPresignedUrl } from "@/actions/r2";
import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_PUBLIC_URL!,
  credentials: {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: File, folder: string) {
  const { presignedURL, fileURL, success } = await getPresignedUrl(
    file.name,
    file.type,
    folder,
  );
  if (!success && !presignedURL)
    return {
      success,
      fileURL: null,
    };

  //@ts-expect-error
  await fetch(presignedURL, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  return {
    success: true,
    fileURL,
  };
}


export async function uploadFiles(files: File[], folder: string) {
    return Promise.all(files.map((file: File) => uploadFile(file, folder)));
}