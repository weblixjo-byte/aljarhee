import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data format" }, { status: 400 });
    }

    // Try to write to Supabase first if keys are configured
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      try {
        // Clear existing products
        const { error: deleteError } = await supabaseAdmin
          .from("products")
          .delete()
          .neq("id", 0); // Delete all rows where id is not 0 (effectively all rows)

        if (deleteError) {
          throw new Error(`Failed to clear existing products: ${deleteError.message}`);
        }

        // Insert new products in batches (to avoid limits if the list is huge)
        const batchSize = 100;
        for (let i = 0; i < products.length; i += batchSize) {
          const batch = products.slice(i, i + batchSize).map((p: any) => ({
            id: Number(p.id),
            name: p.name,
            category: p.category,
            categoryName: p.categoryName || "",
            brand: p.brand || "",
            model: p.model || "",
            year: String(p.year || "all"),
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            condition: p.condition || "new",
            conditionText: p.conditionText || "جديد",
            image: p.image || "",
            description: p.description || "",
            featured: Boolean(p.featured),
            bestSeller: Boolean(p.bestSeller),
            newArrival: Boolean(p.newArrival),
          }));

          const { error: insertError } = await supabaseAdmin
            .from("products")
            .insert(batch);

          if (insertError) {
            throw new Error(`Failed to insert batch: ${insertError.message}`);
          }
        }

        console.log(`Successfully imported ${products.length} products to Supabase.`);
        return NextResponse.json({ success: true, count: products.length, source: "supabase" });
      } catch (dbErr: any) {
        console.error("Supabase import failed, falling back to local file:", dbErr);
        // Fall through to local write fallback
      }
    }

    // Fallback: Write file to disk
    const filePath = path.join(process.cwd(), "src", "data", "imported_products.json");
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json({ success: true, count: products.length, source: "local" });
  } catch (err: any) {
    console.error("Error writing imported products:", err);
    return NextResponse.json({ error: err.message || "Failed to persist products" }, { status: 500 });
  }
}
