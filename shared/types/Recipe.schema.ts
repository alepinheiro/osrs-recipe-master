import { z } from "zod";
import { RecipeItemSchema } from "~~/shared/types/RecipeItem.schema";

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "O nome da receita não pode estar vazio."),
  savedAt: z.string(),
  tags: z.array(z.string()),
  inputs: z.array(RecipeItemSchema),
  outputs: z.array(RecipeItemSchema),
  highAlchMode: z.boolean(),
});

export type Recipe = z.infer<typeof RecipeSchema>;
