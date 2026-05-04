"use server";

import { verifyPassword } from "@/lib/login/manage-login";
import { asyncDelay } from "@/utils/async-daley";
import { error } from "console";

type loginActionState = {
  username: string;
  error: string;
};

export async function loginAction(
  state: loginActionState | undefined,
  formData: FormData,
) {
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

  // aqui o usuario e senha sao validos
  // criar o cookie e redirecionar a pagina
}
