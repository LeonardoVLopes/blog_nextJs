import { postRepository } from "@/repositories/post/index";
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
        <PostsList />
      </Suspense>
    </>
  );
}
