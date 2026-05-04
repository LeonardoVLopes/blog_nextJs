"use server";

import { asyncDelay } from "@/utils/async-daley";
import { error } from "console";

type loginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: loginActionState, formData: FormData) {
  await asyncDelay(5000);

  if (!(formData instanceof FormData)) {
    return {
      username: "",
      error: "Dados invalidos",
    };
  }

  // dados que o usuario digitou no form
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // aqui eu verifico se o usuario existe na base de dados
  const isUsernameValid = username === process.env.LOGIN_USER;
  const isPasswordValid = password ===

  return {
    username: "",
    error: "",
  };
}
