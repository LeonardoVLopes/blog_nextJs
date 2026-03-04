// import { JsonPostRepository } from "@/repositories/post/json-post-repository";
// import { drizzleDb } from ".";
// import { postsTable } from "./schemas";

// async () => {
//   const jsonPostRepository = new JsonPostRepository();
//   const posts = await jsonPostRepository.findAll();

//   await drizzleDb.insert(postsTable).values(posts)
// };

import { JsonPostRepository } from "@/repositories/post/json-post-repository";
import { drizzleDb } from ".";
import { postsTable } from "./schemas";

async function main() {
  console.log("🌱 Iniciando o seeding...");

  try {
    const jsonPostRepository = new JsonPostRepository();
    const posts = await jsonPostRepository.findAll();

    console.log(`📦 Inserindo ${posts.length} posts no banco de dados...`);
    
    await drizzleDb.insert(postsTable).values(posts);

    console.log("✅ Seeding concluído com sucesso!");
    process.exit(0); // Força o script a encerrar após o sucesso
  } catch (error) {
    console.error("❌ Erro ao fazer o seed:", error);
    process.exit(1);
  }
}

// Executa a função!
main();