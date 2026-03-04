"use cache";

import { postRepository } from "@/repositories/post/index";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";

export async function findAllPublicPostsCached() {
  cacheTag("posts");

  return await postRepository.findAllPublic();
}

export async function findPublicPostBySlugCached(slug: string) {
  cacheTag(`post-${slug}`);

  const post = await postRepository
    .findBySlugPublic(slug)
    .catch(() => undefined);

  if (!post) {
    notFound();
  }

  return post;
}
