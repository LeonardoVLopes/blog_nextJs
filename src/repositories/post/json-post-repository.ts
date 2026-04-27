import { postModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";

const ROOT_DIR = process.cwd();
const JSON_POST_FILE_PATH = resolve(
  ROOT_DIR,
  "src",
  "db",
  "seed",
  "posts.json",
);

const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

export class JsonPostRepository implements PostRepository {
  private async simulateWait() {
    if (simulateWaitMs <= 0) return;

    await new Promise((resolve) => setTimeout(resolve, simulateWaitMs));
  }

  private async readFromDisk(): Promise<postModel[]> {
    const jsonContent = await readFile(JSON_POST_FILE_PATH, "utf-8");
    const parsedJson = JSON.parse(jsonContent);
    const { posts } = parsedJson;
    return posts;
  }

  private async writeToDisk(posts: postModel[]): Promise<void> {
    const jsonToString = JSON.stringify({ posts }, null, 2);
    await writeFile(JSON_POST_FILE_PATH, jsonToString, "utf-8");
  }

  async findAllPublic(): Promise<postModel[]> {
    const posts = await this.readFromDisk();
    return posts.filter((post) => post.published);
  }

  async findAll(): Promise<postModel[]> {
    const posts = await this.readFromDisk();
    return posts;
  }

  async findById(id: string): Promise<postModel> {
    const posts = await this.findAllPublic();
    const post = posts.find((post) => post.id === id);

    if (!post) throw new Error("post nao encontrado para ID");
    return post;
  }

  async findBySlugPublic(slug: string): Promise<postModel> {
    const posts = await this.findAllPublic();
    const post = posts.find((post) => post.slug === slug);

    if (!post) throw new Error("post nao encontrado para slug");
    return post;
  }

  async create(post: postModel): Promise<postModel> {
    const posts = await this.findAll();

    if (!post.id || !post.slug) {
      throw new Error("Post sem ID ou Slug");
    }

    const idOrSlugExist = posts.find(
      (savedPost) => savedPost.id === post.id || savedPost.slug === post.slug,
    );

    if (idOrSlugExist) {
      throw new Error("ID ou Slug devem ser Unicos");
    }

    posts.push(post);
    await this.writeToDisk(posts);

    return post;
  }

  async delete(id: string): Promise<postModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex < 0) {
      throw new Error("Post nao existe");
    }

    const post = posts[postIndex];
    posts.slice(postIndex, 1);
    await this.writeToDisk(posts);

    return post;
  }

  async update(
    id: string,
    newPostData: Omit<postModel, "id" | "slug" | "createdAt" | "updatedAt">,
  ): Promise<postModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);
    const savedPost = posts[postIndex];

    if (postIndex < 0) {
      throw new Error("Post nao existe");
    }

    const newPost = {
      ...savedPost,
      ...newPostData,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = newPost;
    await this.writeToDisk(posts);

    return newPost;
  }
}
