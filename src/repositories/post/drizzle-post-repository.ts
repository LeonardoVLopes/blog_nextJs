import { postModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schemas";
import { desc, eq } from "drizzle-orm";

export class DrizzlePostRepository implements PostRepository {
  // busca somente os posts com published true
  async findAllPublic(): Promise<postModel[]> {
    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  // busca somente os posts com published true
  async findBySlugPublic(id: string): Promise<postModel> {}

  async findAll(): Promise<postModel[]> {}

  async findById(id: string): Promise<postModel> {}
}

async () => {
  const repo = new DrizzlePostRepository();
  const posts = await repo.findAllPublic();
};
