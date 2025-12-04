import { z } from "zod";

export const OsrsItemPriceSchema = z.object({
  high: z.number(),
  highTime: z.number(),
  low: z.number(),
  lowTime: z.number(),
});

export const OsrsItemPriceResponseSchema = z.object({
  data: z.record(z.uuid(), OsrsItemPriceSchema),
});

export type OsrsItemPrice = z.infer<typeof OsrsItemPriceSchema>;
export type OsrsItemPriceResponse = z.infer<typeof OsrsItemPriceResponseSchema>;
