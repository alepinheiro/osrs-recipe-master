import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

export type SupportedLocale = "pt-BR" | "en-US";

const localeMap: Record<SupportedLocale, Locale> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

export function formatDateLocale(
  date: string | Date,
  formatStr: string,
  locale: SupportedLocale = "pt-BR",
) {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: localeMap[locale] });
}
