import { PostCoverImg } from "../PostCoverImg";
import { PostSummary } from "../PostSummary";
import { findAllPublicPosts } from "@/lib/post/queries";

export async function Postfeatured() {
  const posts = await findAllPublicPosts();
  const post = posts[0];

  const postLink = `/post/${post.slug}`;

  return (
    <section className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2 group">
      <PostCoverImg
        href={postLink}
        src={post.coverImageUrl}
        width={1200}
        height={720}
        alt={post.title}
      />
      <PostSummary
        postLink={postLink}
        postHeading="h1"
        createdAt={post.createdAt}
        title={post.title}
        excerpt={post.excerpt}
      />
    </section>
  );
}
