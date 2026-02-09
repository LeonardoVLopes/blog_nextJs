import { postModel } from "@/models/post/post-model";

export interface PostRepository {
  findAllPublic(): Promise<postModel[]>;
  findById(id: string): Promise<postModel>;
}
