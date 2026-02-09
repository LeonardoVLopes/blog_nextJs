import { postRepository } from "@/repositories/post/json-post-repository";
import { PostCoverImg } from "../PostCoverImg";
import { PostHeading } from "../PostHeading";

export default async function PostsList() {
  const posts = await postRepository.findAll();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="flex flex-col gap-4 sm:justify-center">
              <time
                dateTime={post.createdAt}
                className="text-slate-600 block text-sm/tight"
              >
                {post.createdAt}
              </time>
              <PostHeading as="h2" url={postLink}>
                {post.title}
              </PostHeading>

              <p>{post.excerpt}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
