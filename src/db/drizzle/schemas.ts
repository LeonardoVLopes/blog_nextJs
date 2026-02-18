import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImageUrl: text("cover_Image_Url").notNull(),
  published: integer("published", { mode: "boolean" }).notNull(),
  createdAt: text("created_At").notNull(),
  updatedAt: text("updated_At").notNull(),
});

export type postsTableSelectMode = InferSelectModel<typeof postsTable>;
export type postsTableInsertMode = InferInsertModel<typeof postsTable>;
