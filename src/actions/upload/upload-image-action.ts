"use server";

import { IMAGE_UPLOAD_MAX_SIZE } from "@/lib/constants";
import { logColor } from "@/utils/log-color";
import { error } from "console";

type uploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(): Promise<uploadImageActionResult> {
  const makeResult = ({ url = "", error = "" }) => ({ url, error });

  if (!(FormData instanceof FormData)) {
    return makeResult({ error: "dados invalidos" });
  }

  const file = FormData.get("file");

  if (!(file instanceof File)) {
    return makeResult({ error: "arquivo invalido" });
  }

  if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
    return makeResult({ error: "arquivo muito grande" });
  }

  if (file.type.startsWith("image/")) {
    return makeResult({ error: "Image invalida" });
  }

  return makeResult({ url: "URL" });
}
