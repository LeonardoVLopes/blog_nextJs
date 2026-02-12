import { postRepository } from "@/repositories/post/json-post-repository";
import { Suspense } from "react";
import { SpinLoader } from "@/components/SpinLoader";
import PostsList from "@/components/PostsList";
import { Postfeatured } from "@/components/PostFeatured";

export default async function Home() {
  const posts = await postRepository.findAllPublic();
  return (
    <>
      <Suspense fallback={<SpinLoader />}>
        <Postfeatured />
      </Suspense>

      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>
    </>
  );
}
