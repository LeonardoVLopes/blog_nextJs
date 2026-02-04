import { postRepository } from "@/repositories/post/json-post-repository";
import { Suspense } from "react";
import { SpinLoader } from "@/components/SpinLoader";
import PostsList from "@/components/PostsList";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const posts = await postRepository.findAll();
  return (
    <Container>
      <Header />

      <section className="grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 group">
        <Link className="w-full h-full overflow-hidden rounded-xl" href="#">
          <Image
            className="group-hover:scale-105 transition"
            src="/img/bryen_0.png"
            width={1200}
            height={720}
            alt="titulo do post"
          />
        </Link>
        <div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis
          voluptatibus eius suscipit reprehenderit maiores! Reprehenderit
          aliquid error possimus dicta itaque tenetur. Quia, corrupti tempora
          maxime odio perferendis iure ab vero.
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
