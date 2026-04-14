"use server";

type createPostActionState = {
  numero: number;
};

export async function createPostAction(
  prevState: createPostActionState,
): Promise<createPostActionState> {
  return {
    numero: prevState.numero,
  };
}
