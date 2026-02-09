import { postRepository } from "@/repositories/post/json-post-repository";
import { Suspense } from "react";
import { SpinLoader } from "@/components/SpinLoader";
import PostsList from "@/components/PostsList";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { Postfeatured } from "@/components/PostFeatured";

export default async function Home() {
  const posts = await postRepository.findAll();
  return (
    <Container>
      <Header />

      <Suspense fallback={<SpinLoader />}>
        <Postfeatured />
      </Suspense>

      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>

      <footer>
        <h1 className="text-6xl font-bold text-center py-8">Footer</h1>
      </footer>
    </Container>
  );
}
