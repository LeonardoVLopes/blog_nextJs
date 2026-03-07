import { MenuAdmin } from "@/components/Admin/MenuAdmin";

export default function AdminPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <MenuAdmin />
      {children}
    </>
  );
}
