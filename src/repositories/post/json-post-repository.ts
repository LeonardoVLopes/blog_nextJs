import { postModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { parse, resolve } from "path";
import { readFile } from "fs/promises";

const ROOT_DIR = process.cwd();
const JSON_POST_FILE_PATH = resolve(
  ROOT_DIR,
  "src",
  "db",
  "seed",
  "posts.json",
);

export class JsonPostRepository implements PostRepository {
  private async readFromDisk(): Promise<postModel[]> {
    const jsonContent = await readFile(JSON_POST_FILE_PATH, "utf-8");
    const parsedJson = JSON.parse(jsonContent);
    const { posts } = parsedJson;
    return posts;
  }

  async findAll(): Promise<postModel[]> {
    const posts = await this.readFromDisk();
    return posts;
  }

  async findById(id: string): Promise<postModel> {
    const posts = await this.findAll();
    const post = posts.find((post) => post.id === id);

    if (!post) throw new Error("post nao encontrado");
    return post;
  }
}

export const postRepository: PostRepository = new JsonPostRepository();
