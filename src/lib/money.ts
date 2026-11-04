// The API stores integer cents; the UI shows reais. No floating point.

const MAX_PRICE_CENTS = 100_000_000;

/** 2500 → "R$ 25,00" */
export function formatPrice(cents: number): string {
  return `R$ ${formatAmount(cents)}`;
}

/** 2500 → "25,00" (price field value) */
export function formatAmount(cents: number): string {
  const units = Math.floor(cents / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fraction = (cents % 100).toString().padStart(2, "0");
  return `${units},${fraction}`;
}

/**
 * Price mask while typing: digits come in from the right, as cents.
 * "2" → "0,02", "250" → "2,50", "125000" → "1.250,00". No digits → "".
 * Returns null when the value would go over the maximum (the keystroke is ignored).
 */
export function maskPrice(text: string): string | null {
  const digits = text.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  const cents = Number(digits);
  return cents <= MAX_PRICE_CENTS ? formatAmount(cents) : null;
}

/** "25", "25,5", "1.250,00" → cents; null if it is not a valid price. */
export function parsePrice(text: string): number | null {
  const clean = text.trim().replace(/\s/g, "");
  const normalized = clean.includes(",") ? clean.replace(/\./g, "") : clean;
  const match = /^(\d+)(?:[.,](\d{0,2}))?$/.exec(normalized);
  if (!match) return null;
  const cents =
    Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  return cents <= MAX_PRICE_CENTS ? cents : null;
}
