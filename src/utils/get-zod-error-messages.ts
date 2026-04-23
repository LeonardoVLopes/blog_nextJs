import { ZodError } from "zod";

export function getZodErrorMessages(error: ZodError): string[] {
  // error.issues já é um array com todos os problemas encontrados na validação
  return error.issues.map((issue) => issue.message);
}
