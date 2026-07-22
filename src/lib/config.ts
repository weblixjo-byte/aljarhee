export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aljarhee-sp.com";

/**
 * Transliterates Arabic characters to clean ASCII/Latin letters.
 */
function arabicToLatin(text: string): string {
  const map: Record<string, string> = {
    أ: "a", إ: "a", آ: "a", ا: "a", ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh",
    د: "d", ذ: "dh", ر: "r", ز: "z", س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z",
    ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w",
    ي: "y", ى: "a", ة: "h", ء: "", ؤ: "w", ئ: "y"
  };

  return text
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Creates a 100% clean, ASCII/Latin URL slug for social sharing and SEO.
 * Example: createSlug(61, "هوب خلفي", "toyota", "camry") → "61-toyota-camry-hwb-khlfy"
 * This prevents %D9%87%D8%A8 encoding issues on WhatsApp & messaging apps.
 */
export function createSlug(id: number, name: string, brand?: string, model?: string): string {
  const cleanBrand = brand && brand.toLowerCase() !== "all"
    ? brand.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "";
  const cleanModel = model && model.toLowerCase() !== "all"
    ? model.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "";

  const latinName = arabicToLatin(name)
    .split("-")
    .filter(Boolean)
    .slice(0, 3)
    .join("-");

  const parts = [id, cleanBrand, cleanModel, latinName].filter(Boolean);
  return parts.join("-");
}

/**
 * Extracts the numeric product ID from a slug (handles encoded, decoded, or Latin slugs).
 * Example: extractIdFromSlug("61-toyota-camry-hwb-khlfy") → 61
 */
export function extractIdFromSlug(slug: string): number {
  const decoded = decodeURIComponent(slug);
  const match = decoded.match(/^(\d+)/);
  return match ? Number(match[1]) : NaN;
}
