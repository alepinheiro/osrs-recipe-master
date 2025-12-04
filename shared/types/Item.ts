/**
 * Item do Old School RuneScape
 * Retornado pela API: https://api.osrs.exchange/items/all
 */
export type Item = {
  id: number;
  name: string;
  slug: string;
  limit: number;
  icon: string; // Nome do arquivo (ex: "Justiciar legguards.png")
  value: number;
  lowalch: number;
  highalch: number;
  members: boolean;
  examine: string;
  wiki_url: string;
};
