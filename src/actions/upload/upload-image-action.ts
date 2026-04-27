"use server";

import {
  IMAGE_SERVER_URL,
  IMAGE_UPLOAD_DIRECTORY,
  IMAGE_UPLOAD_MAX_SIZE,
} from "@/lib/constants";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type uploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<uploadImageActionResult> {
  const makeResult = ({ url = "", error = "" }) => ({ url, error });

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "arquivo invalido" });
  }

  const uploadMaxSize =
    Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
  if (file.size > uploadMaxSize) {
    return makeResult({ error: "arquivo muito grande" });
  }

  if (!file.type.startsWith("image/")) {
    return makeResult({ error: "Image invalida" });
  }

  const imageExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${imageExtension}`;

  const uploadDir = process.env.IMAGE_UPLOAD_DIRECTORY || "uploads";
  const uploadFullPath = resolve(process.cwd(), "public", uploadDir);
  await mkdir(uploadFullPath, { recursive: true });

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);

  await writeFile(fileFullPath, buffer);

  const imgServerUrl =
    process.env.IMAGE_SERVER_URL || "http://localhost:3000/uploads";
  const url = `${imgServerUrl}/${uniqueImageName}`;

  return makeResult({ url });
}
