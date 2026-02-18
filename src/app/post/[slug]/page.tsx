import { SinglePost } from "@/components/SinglePost";
import { SpinLoader } from "@/components/SpinLoader";
import {
  findAllPublicPostsCached,
  findPostBySlugCached,
} from "@/lib/post/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { title } from "process";
import { Suspense } from "react";

type PostSlugPagePros = {
  params: Promise<{ slug: string }>;
};

export async function generateMetaData({
  params,
}: PostSlugPagePros): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPostBySlugCached(slug);

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostSlugPage({ params }: PostSlugPagePros) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SpinLoader />}>
      <SinglePost slug={slug} />
    </Suspense>
  );
}
