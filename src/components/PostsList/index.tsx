import { postRepository } from "@/repositories/post/json-post-repository";

export default async function PostsList() {
  const posts = await postRepository.findAll();

  return (
    <div>
      {posts.map((post) => {
        return <p>{post.title}</p>;
      })}
    </div>
  );
}
