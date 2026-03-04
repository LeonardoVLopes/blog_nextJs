import { postModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schemas";
import { desc, eq } from "drizzle-orm";
import { logColor } from "@/utils/log-color";
import { asyncDelay } from "@/utils/async-daley";
import { SIMULATE_WAIT_IN_MS } from "@/lib/constants";

export class DrizzlePostRepository implements PostRepository {
  // busca somente os posts com published true
  async findAllPublic(): Promise<postModel[]> {
    await asyncDelay(SIMULATE_WAIT_IN_MS, true);
    logColor("findAllPublic", Date.now());

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  // busca somente os posts com published true
  async findBySlugPublic(slug: string): Promise<postModel> {
    await asyncDelay(SIMULATE_WAIT_IN_MS, true);
    logColor("findBySlugPublic", Date.now());

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq, and }) =>
        and(eq(posts.published, true), eq(posts.slug, slug)),
    });

    if (!post) throw new Error("post nao encontrado para slug");

    return post;
  }

  async findAll(): Promise<postModel[]> {
    await asyncDelay(SIMULATE_WAIT_IN_MS, true);
    logColor("findAll", Date.now());

    const posts = await drizzleDb.query.posts.findMany();

    return posts;
  }

  async findById(id: string): Promise<postModel> {
    await asyncDelay(SIMULATE_WAIT_IN_MS, true);
    logColor("findById", Date.now());

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) throw new Error("post nao encontrado para ID");

    return post;
  }
}

async () => {
  const repo = new DrizzlePostRepository();
  const post = await repo.findAllPublic();

  console.log(post);
};
