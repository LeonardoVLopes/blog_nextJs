"use server";

import { createLoginSession, verifyPassword } from "@/lib/login/manage-login";
import { asyncDelay } from "@/utils/async-daley";
import { error } from "console";
import { redirect } from "next/navigation";

type loginActionState = {
  username: string;
  error: string;
};

export async function loginAction(
  state: loginActionState | undefined,
  formData: FormData,
) {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return {
      username: "",
      error: "Login not allowed",
    };
  }

  await asyncDelay(5000);

  if (!(formData instanceof FormData)) {
    return {
      username: "",
      error: "Dados invalidos",
    };
  }

  // dados que o usuario digitou no form
  const username = formData.get("username")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  if (!username || !password) {
    return {
      username,
      error: "Digite o usuario e a senha",
    };
  }

  // aqui eu verifico se o usuario existe na base de dados
  const isUsernameValid = username === process.env.LOGIN_USER;
  const isPasswordValid = await verifyPassword(
    password,
    process.env.LOGIN_PASS || "",
  );

  if (!isUsernameValid || !isPasswordValid) {
    return {
      username,
      error: "usuario ou senha invalidos",
    };
  }

  await createLoginSession(username);
  redirect("/admin/post");
}
