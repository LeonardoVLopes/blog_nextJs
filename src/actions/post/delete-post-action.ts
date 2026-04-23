"use server";

import { postRepository } from "@/repositories/post";
import { revalidateTag } from "next/cache";

export async function deletePostAction(id: string) {
  if (!id || typeof id !== "string") {
    return {
      error: "Dados invalidos",
    };
  }

  let post;
  try {
    post = await postRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        errors: e.message,
      };
    }

    return {
      errors: "Erro desconhecido",
    };
  }

  // revalidateTag ou revalidatePath
  revalidateTag("posts", "max");
  revalidateTag(`post-${post.slug}`, "max");

  return {
    error: "",
  };
}
