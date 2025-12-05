export type SupportedCurrency = "BRL" | "USD" | "EUR";

export function formatPriceLocale(
  value: number,
  currency: SupportedCurrency = "BRL",
  locale: string = "pt-BR",
) {
  return value.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
