"use server";

import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl(
  fileName: string,
  fileType: string,
  folder: string = "products",
) {
  try {
    const ext = fileName.split(".").pop();
    const key = `${folder}/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const presignedURL = await getSignedUrl(r2, command, {
      expiresIn: 60,
    });

    const fileURL = `${process.env.R2_PUBLIC_FETCH_URL!}/${key}`;

    return {
      success: true,
      presignedURL,
      fileURL,
    };
  } catch (error) {
    console.error;
    return {
      success: false,
      presignedURL: null,
      fileURL: null,
    };
  }
}
