import { z } from "zod";
import { OsrsItemPriceSchema } from "~~/shared/types/OsrsItemPrice";

/**
 * Schema Zod para o Item do Old School RuneScape.
 * Retornado pela API: https://api.osrs.exchange/items/all
 * Cada campo possui descrição detalhada para validação e documentação.
 */
export const ItemSchema = z.object({
  id: z.string().describe("ID único do item"),
  name: z.string().describe("Nome do item"),
  slug: z.string().describe("Slug do item (identificador URL)"),
  limit: z.number().describe("Limite de compra/venda no GE"),
  icon: z
    .string()
    .describe('Nome do arquivo do ícone (ex: "Justiciar legguards.png")'),
  value: z.number().describe("Valor base do item"),
  lowalch: z.number().describe("Valor de low alchemy"),
  highalch: z.number().describe("Valor de high alchemy"),
  members: z.boolean().describe("Indica se o item é exclusivo para membros"),
  examine: z.string().describe("Texto de examine do item"),
  wiki_url: z.string().describe("URL da wiki do item"),
  gePrices: OsrsItemPriceSchema.describe("Preços do Grand Exchange"),
});

/**
 * Tipo TypeScript inferido do schema Zod de Item.
 */
export type Item = z.infer<typeof ItemSchema>;
