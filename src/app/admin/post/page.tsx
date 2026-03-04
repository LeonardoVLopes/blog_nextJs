import { findAllPostAdmin } from "@/lib/post/queries/admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Admin",
};

export default async function AdminPostPage() {
  const posts = await findAllPostAdmin();
  return (
    <div className="">
      {posts.map((post) => {
        return <p key={post.id}>{post.title}</p>;
      })}
    </div>
  );
}
