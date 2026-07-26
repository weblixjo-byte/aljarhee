import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const settings = await req.json();
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not initialized" }, { status: 500 });
    }

    console.log("Upserting category settings row (ID: 0)...");

    const { error } = await supabaseAdmin
      .from("products")
      .upsert({
        id: 0,
        name: "__CATEGORY_SETTINGS__",
        description: JSON.stringify(settings),
        category: "settings",
        categoryName: "إعدادات الأقسام",
        brand: "settings",
        model: "settings",
        year: "all",
        price: 0,
        image: "",
        featured: false,
        bestSeller: false,
        newArrival: false
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving category settings:", err);
    return NextResponse.json({ error: err.message || "Failed to save settings" }, { status: 500 });
  }
}
