import { isUrlOrRelativePath } from "@/utils/is-url-or-relative-path";
import { title } from "process";
import { refine, string, z } from "zod";

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "titulo deve ter, no minimo 3 caracteres")
    .max(120, "titulo deve ter um maximo de 120 caracteres"),
  content: z
    .string()
    .trim()
    .min(3, "conteudo e obrigatorio")
    .transform((val) => val),
  author: z
    .string()
    .trim()
    .min(4, "autor precisa de um minimo de 4 caracteres")
    .max(100, "nome do autor nao deve ter mais que 100 caracteres"),
  excerpt: z
    .string()
    .trim()
    .min(3, "excerto precisa de um minimo de 3 caracteres")
    .max(200, "excerto nao deve ter mais que 200 caracteres"),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: "URL da capa deve ser uma URL ou caminho para imagem",
  }),
  published: z
    .union([
      z.literal("on"),
      z.literal("true"),
      z.literal("false"),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform((val) => val === "on" || val === "true" || val === true),
});

export const PostCreateSchema = PostBaseSchema

export const PostUpdateSchema = PostBaseSchema.extend({

})