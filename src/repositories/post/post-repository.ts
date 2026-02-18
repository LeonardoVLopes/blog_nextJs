import { postModel } from "@/models/post/post-model";

export interface PostRepository {
  findAllPublic(): Promise<postModel[]>;
  findAll(): Promise<postModel[]>;
  findById(id: string): Promise<postModel>;
  findBySlugPublic(id: string): Promise<postModel>;
}
