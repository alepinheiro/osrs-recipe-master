import { z } from "zod";

/**
 * Latest price info for an OSRS item.
 *
 * @property high - Latest instant-buy price (can be null if never seen)
 * @property highTime - Unix timestamp of latest instant-buy (can be null if never seen)
 * @property low - Latest instant-sell price (can be null if never seen)
 * @property lowTime - Unix timestamp of latest instant-sell (can be null if never seen)
 */
export const OsrsItemPriceSchema = z.object({
  /** Latest instant-buy price, or null if never seen */
  high: z.number().describe("Latest instant-buy price, or null if never seen"),
  /** Unix timestamp of latest instant-buy, or null if never seen */
  highTime: z
    .number()
    .describe("Unix timestamp of latest instant-buy, or null if never seen"),
  /** Latest instant-sell price, or null if never seen */
  low: z.number().describe("Latest instant-sell price, or null if never seen"),
  /** Unix timestamp of latest instant-sell, or null if never seen */
  lowTime: z
    .number()
    .describe("Unix timestamp of latest instant-sell, or null if never seen"),
});

/**
 * Response for /latest endpoint: Map from itemId to OsrsItemPrice
 */
export const OsrsItemPriceResponseSchema = z.object({
  data: z.record(z.uuid(), OsrsItemPriceSchema),
});

export type OsrsItemPrice = z.infer<typeof OsrsItemPriceSchema>;
export type OsrsItemPriceResponse = z.infer<typeof OsrsItemPriceResponseSchema>;
