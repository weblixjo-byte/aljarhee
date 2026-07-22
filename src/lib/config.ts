export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aljarhee-sp.com";

/**
 * Creates an SEO-friendly slug from a product ID and name.
 * Example: createSlug(42, "فلتر زيت تويوتا كامري") → "42-فلتر-زيت-تويوتا-كامري"
 * The numeric ID prefix guarantees uniqueness and allows backward lookup.
 */
export function createSlug(id: number, name: string): string {
  const normalized = name
    .trim()
    .replace(/\s+/g, "-")       // spaces → dashes
    .replace(/[/\\?%*:|"<>]/g, "") // remove unsafe URL chars
    .replace(/-{2,}/g, "-")     // collapse multiple dashes
    .replace(/^-|-$/g, "");     // trim leading/trailing dashes
  return `${id}-${normalized}`;
}

/**
 * Extracts the numeric product ID from a slug (handles encoded or decoded slugs).
 * Example: extractIdFromSlug("42-%D9%81%D9%84%D8%AA%D8%B1") → 42
 */
export function extractIdFromSlug(slug: string): number {
  const decoded = decodeURIComponent(slug);
  const match = decoded.match(/^(\d+)/);
  return match ? Number(match[1]) : NaN;
}
