import { findPostBySlugCached } from "@/lib/post/queries";
import { notFound } from "next/navigation";

type PostSlugPagePros = {
  params: Promise<{ slug: string }>;
};

export default async function PostSlugPage({ params }: PostSlugPagePros) {
  const { slug } = await params;

  const post = await findPostBySlugCached(slug);

  return (
    <div>
      <p>{post.title}</p>
    </div>
  );
}
