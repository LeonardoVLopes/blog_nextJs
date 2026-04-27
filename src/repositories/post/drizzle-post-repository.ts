import { postModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schemas";
import { eq } from "drizzle-orm";
import { logColor } from "@/utils/log-color";
import { asyncDelay } from "@/utils/async-daley";

const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

export class DrizzlePostRepository implements PostRepository {
  // busca somente os posts com published true
  async findAllPublic(): Promise<postModel[]> {
    await asyncDelay(simulateWaitMs, true);
    logColor("findAllPublic", Date.now());

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  // busca somente os posts com published true
  async findBySlugPublic(slug: string): Promise<postModel> {
    await asyncDelay(simulateWaitMs, true);
    logColor("findBySlugPublic", Date.now());

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq, and }) =>
        and(eq(posts.published, true), eq(posts.slug, slug)),
    });

    if (!post) throw new Error("post nao encontrado para slug");

    return post;
  }

  async findAll(): Promise<postModel[]> {
    await asyncDelay(simulateWaitMs, true);
    logColor("findAll", Date.now());

    const posts = await drizzleDb.query.posts.findMany();

    return posts;
  }

  async findById(id: string): Promise<postModel> {
    await asyncDelay(simulateWaitMs, true);
    logColor("findById", Date.now());

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) throw new Error("post nao encontrado para ID");

    return post;
  }

  async create(post: postModel): Promise<postModel> {
    const postExists = await drizzleDb.query.posts.findFirst({
      where: (posts, { or, eq }) =>
        or(eq(posts.id, post.id), eq(posts.slug, post.slug)),
      columns: { id: true },
    });

    if (!!postExists) {
      throw new Error("Post com ID ou Slug ja existe na base de dados");
    }

    await drizzleDb.insert(postsTable).values(post);
    return post;
  }

  async delete(id: string): Promise<postModel> {
    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new Error("Post nao existe");
    }

    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

    return post;
  }

  async update(
    id: string,
    newPostData: Omit<postModel, "id" | "slug" | "creatdAt" | "updatedAt">,
  ): Promise<postModel> {
    const oldPost = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!oldPost) {
      throw new Error("Post nao existe");
    }

    const now = new Date().toISOString();
    const postData = {
      author: newPostData.author,
      content: newPostData.content,
      coverImageUrl: newPostData.coverImageUrl,
      excerpt: newPostData.excerpt,
      published: newPostData.published,
      title: newPostData.title,
      updatedAt: now,
    };
    await drizzleDb
      .update(postsTable)
      .set(postData)
      .where(eq(postsTable.id, id));

    return {
      ...oldPost,
      ...postData,
    };
  }
}

async () => {
  const repo = new DrizzlePostRepository();
  const post = await repo.findAllPublic();

  console.log(post);
};
