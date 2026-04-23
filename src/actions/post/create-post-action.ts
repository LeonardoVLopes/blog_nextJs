"use server";

import { makePartialPublicPost, PublicPost } from "@/dto/dto";
import { PostCreateSchema } from "@/lib/post/validations";
import { postModel } from "@/models/post/post-model";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";

type createPostActionState = {
  formState: PublicPost;
  errors: string[];
};

export async function createPostAction(
  prevState: createPostActionState,
  formData: FormData,
): Promise<createPostActionState> {
  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ["Dados invalidos"],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(),
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost: postModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: Date.now().toString(),
    slug: Math.random().toString(36),
  };

  return {
    formState: newPost,
    errors: [],
  };
}
