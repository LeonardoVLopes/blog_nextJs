"use server";

import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schemas";
import { postRepository } from "@/repositories/post";
import { asyncDelay } from "@/utils/async-daley";
import { logColor } from "@/utils/log-color";
import { profile } from "console";
import { eq, max } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function deletePostAction(id: string) {
  await asyncDelay(2000);
  logColor("" + id);

  if (!id || typeof id !== "string") {
    return {
      error: "Dados invalidos",
    };
  }

  const post = await postRepository.findById(id).catch(() => undefined);

  if (!post) {
    return {
      error: "Post nao existe",
    };
  }

  // mover este metodo para o repositorio
  await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

  // revalidateTag ou revalidatePath
  revalidateTag("posts", "max");
  revalidateTag(`post-${post.slug}`, "max");

  return {
    error: "",
  };
}
