import { PostCoverImg } from "../PostCoverImg";
import { PostSummary } from "../PostSummary";
import { findAllPublicPosts } from "@/lib/post/queries";

export default async function PostsList() {
  const posts = await findAllPublicPosts();

  return (
    <div className="grid grid-cols-1 mb-16 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const postLink = `/post/${post.slug}`;

        return (
          <div className="flex flex-col group gap-4" key={post.id}>
            <PostCoverImg
              href={postLink}
              src={post.coverImageUrl}
              width={1200}
              height={720}
              alt={post.title}
            />

            <PostSummary
              postLink={postLink}
              postHeading="h2"
              createdAt={post.createdAt}
              title={post.title}
              excerpt={post.excerpt}
            />
          </div>
        );
      })}
    </div>
  );
}
