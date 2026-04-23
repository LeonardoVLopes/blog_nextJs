import { postModel } from "@/models/post/post-model";

export interface PostRepository {
  findAllPublic(): Promise<postModel[]>;
  findAll(): Promise<postModel[]>;
  findById(id: string): Promise<postModel>;
  findBySlugPublic(id: string): Promise<postModel>;

  // mutation
  create(post: postModel): Promise<postModel>;
  delete(id: string): Promise<postModel>;
  update(
    id: string,
    newPostData: Omit<postModel, "id" | "slug" | "creatdAt" | "updatedAt">,
  ): Promise<postModel>;
}
