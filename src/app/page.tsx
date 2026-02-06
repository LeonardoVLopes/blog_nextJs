import { postRepository } from "@/repositories/post/json-post-repository";
import { Suspense } from "react";
import { SpinLoader } from "@/components/SpinLoader";
import PostsList from "@/components/PostsList";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { PostHeading } from "@/components/PostHeading";
import { PostCoverImg } from "@/components/PostCoverImg";

export default async function Home() {
  const posts = await postRepository.findAll();
  return (
    <Container>
      <Header />

      <section className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2 group">
        <PostCoverImg
          href="#"
          src="/img/bryen_0.png"
          width={1200}
          height={720}
          alt="Titulo do post"
        />
        <div className="flex flex-col gap-4 sm:justify-center">
          <time
            dateTime="{post.createdAt}"
            className="text-slate-600 block text-sm/tight"
          >
            05/02/2026 10:00
          </time>
          <PostHeading as="h1" url="#">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </PostHeading>
        </div>
      </section>

      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>

      <footer>
        <h1 className="text-6xl font-bold text-center py-8">Footer</h1>
      </footer>
    </Container>
  );
}
