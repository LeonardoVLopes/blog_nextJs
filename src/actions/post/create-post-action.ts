"use server";

import { PublicPost } from "@/dto/dto";

type createPostActionState = {
  formState: PublicPost;
  errors: string[];
};

export async function createPostAction(
  prevState: createPostActionState,
  formData: FormData,
): Promise<createPostActionState> {
  
  return {
    formState: prevState.formState,
    errors: [],
  };
}
