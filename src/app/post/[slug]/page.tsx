import { findPostBySlugCached } from "@/lib/post/queries";
import { notFound } from "next/navigation";

type PostSlugPagePros = {
  params: Promise<{ slug: string }>;
};

export default async function PostSlugPage({ params }: PostSlugPagePros) {
  const { slug } = await params;

  let post;
  try {
    post = await findPostBySlugCached(slug);
  } catch {
    post = undefined;
  }

  if (!post) notFound();

  return <p>{post.title}</p>;
}
