import { PostCoverImg } from "../PostCoverImg";
import { PostHeading } from "../PostHeading";
import { PostSummary } from "../PostSummary";

export function Postfeatured() {
  const slug = "qualquer";
  const postLink = `/post/${slug}`;

  return (
    <section className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2 group">
      <PostCoverImg
        href={postLink}
        src="/img/bryen_0.png"
        width={1200}
        height={720}
        alt="Titulo do post"
      />
      <PostSummary
        postLink={postLink}
        postHeading="h1"
        createdAt={"2025-01-07T22:54:10"}
        title={"10 hábitos para aumentar sua produtividade"}
        excerpt={
          "o Next.js já vem com várias decisões prontas, permitindo que você comece a desenvolver mais rapidamente."
        }
      />
    </section>
  );
}
