"use server";

import { asyncDelay } from "@/utils/async-daley";
import { error } from "console";

type loginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: loginActionState, formData: FormData) {
  await asyncDelay(5000);

  return {
    username: "",
    error: "",
  };
}
