import { PostCoverImg } from "../PostCoverImg";
import { PostHeading } from "../PostHeading";

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
      <div className="flex flex-col gap-4 sm:justify-center">
        <time
          dateTime="{post.createdAt}"
          className="text-slate-600 block text-sm/tight"
        >
          05/02/2026 10:00
        </time>
        <PostHeading as="h1" url={postLink}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </PostHeading>
      </div>
    </section>
  );
}
