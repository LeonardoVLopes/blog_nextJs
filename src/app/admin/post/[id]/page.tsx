import { ManagePostForm } from "@/components/Admin/ManagePostForm";
import { makePublicPost } from "@/dto/dto";
import { findPostByIdAdmin } from "@/lib/post/queries/admin";
import { notFound } from "next/navigation";

type AdminPostIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminPostIdPage({
  params,
}: AdminPostIdPageProps) {
  const { id } = await params;
  const post = await findPostByIdAdmin(id).catch();

  if (!post) notFound();

  const publicPost = makePublicPost(post);

  return (
    <div className="text-xl font-extrabold">
      <h1>Editar post</h1>
      <ManagePostForm publicPost={publicPost} />
    </div>
  );
}
