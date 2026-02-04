import { postRepository } from "@/repositories/post/json-post-repository";
import { Suspense } from "react";
import { SpinLoader } from "@/components/SpinLoader";
import PostsList from "@/components/PostsList";
import { Container } from "@/components/Container";

export default async function Home() {
  const posts = await postRepository.findAll();
  return (
    <Container>
      <header>
        <h1 className="text-6xl font-bold text-center py-8">Aqui e o header</h1>
      </header>

      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>

      <footer>
        <h1 className="text-6xl font-bold text-center py-8">Footer</h1>
      </footer>
    </Container>
  );
}
