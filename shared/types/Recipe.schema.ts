import { z } from "zod";
import { RecipeItemSchema } from "~~/shared/types/RecipeItem.schema";

export const RecipeSchema = z.object({
  id: z.string().describe("ID único da receita"),
  name: z
    .string()
    .min(1, "O nome da receita não pode estar vazio.")
    .describe("Nome da receita"),
  tags: z
    .array(z.string().describe("Tag da receita"))
    .describe("Lista de tags associadas à receita"),
  inputs: z.array(RecipeItemSchema).describe("Itens de entrada da receita"),
  outputs: z.array(RecipeItemSchema).describe("Itens de saída da receita"),

  highAlchMode: z.boolean().describe("Modo High Alch ativado/desativado"),

  updatedAt: z.string().describe("Data de atualização da receita (ISO)"),
  savedAt: z.string().describe("Data de criação da receita (ISO)"),

  autoUpdatePrices: z
    .boolean()
    .default(false)
    .describe("Flag para atualização automática de preços"),
});

export type Recipe = z.infer<typeof RecipeSchema>;
