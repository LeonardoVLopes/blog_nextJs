import { ManagePostForm } from "@/components/Admin/ManagePostForm";
import { Button } from "@/components/Button";
import { InputCheckBox } from "@/components/InputCheckBox";
import { InputText } from "@/components/InputText";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar post",
};

export default async function AdminPostNewPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-extrabold">Criar post</h1>
      <ManagePostForm />
    </div>
  );
}
