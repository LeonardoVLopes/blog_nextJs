import { postModel } from "@/models/post/post-model";

export type PublicPost = Omit<postModel, "updatedAt">;

export const makePublicPost = (post: postModel): PublicPost => {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    content: post.content,
    coverImageUrl: post.coverImageUrl,
    createdAt: post.createdAt,
    published: post.published,
  };
};
