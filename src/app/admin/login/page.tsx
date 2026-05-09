import { LoginForm } from "@/components/Admin/LoginForm";
import ErrorMessage from "@/components/ErrorMessage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function AdminLoginPage() {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return (
      <ErrorMessage
        contentTitle="403"
        content="libere o sistema de login usando ALLOW_LOGIN"
      />
    );
  }

  return <LoginForm />;
}
