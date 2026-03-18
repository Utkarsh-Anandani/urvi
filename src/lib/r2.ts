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

  //@ts-ignore
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

// https://urvi.8e29220ccf79756d58c904459f91be1c.r2.cloudflarestorage.com/products/1f890ec1-4b83-4642-913b-8cbc7afd2f96.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=53f782d883fd6d109d58382177d9f728%2F20260318%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260318T152038Z&X-Amz-Expires=60&X-Amz-Signature=8fc67ce9f2787cf12070e8b560550d80625f9aa7cd2ce93db85168e724918ced&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject

// https://urvi.8e29220ccf79756d58c904459f91be1c.r2.cloudflarestorage.com/products/3924a688-a4e8-4b45-a4a8-af82bf254a32.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=53f782d883fd6d109d58382177d9f728%2F20260318%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260318T152038Z&X-Amz-Expires=60&X-Amz-Signature=b126291f79a1107789f76af654946b2a0932ecd12381274579f9aeadc6e19ca2&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject