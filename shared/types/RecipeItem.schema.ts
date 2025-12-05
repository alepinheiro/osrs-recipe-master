import { z } from "zod";

export const RecipeItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  buyPrice: z.number(),
  sellPrice: z.number(),
  highAlch: z.number().optional(),
});

export type RecipeItem = z.infer<typeof RecipeItemSchema>;
