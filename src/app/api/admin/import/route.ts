import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";

// Helper to download and upload remote images to Supabase storage
async function uploadImageToSupabase(
  imageUrl: string,
  productId: number,
  supabaseAdmin: any
): Promise<string> {
  // If the image is empty, is a local placeholder, or is already hosted on Supabase, skip
  if (
    !imageUrl ||
    !imageUrl.startsWith("http") ||
    imageUrl.includes("supabase.co") ||
    imageUrl.includes("placeholder")
  ) {
    return imageUrl;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout per image

    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return imageUrl;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Deduce file extension
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("avif")) ext = "avif";
    else if (contentType.includes("gif")) ext = "gif";

    const filePath = `products/${productId}.${ext}`;

    // Upload buffer to the "product-images" bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Storage upload failed for ID ${productId}:`, uploadError.message);
      return imageUrl;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || imageUrl;
  } catch (err: any) {
    console.warn(`Skipped image upload for product ID ${productId} due to error:`, err.message || err);
    return imageUrl;
  }
}

// Concurrency helper to run promises in parallel batches
async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  iteratorFn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(iteratorFn);
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data format" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      try {
        console.log(`Starting Supabase import for ${products.length} products...`);

        // Clear existing products (preserve category settings with ID: 0 and orders with ID: -99)
        const { error: deleteError } = await supabaseAdmin
          .from("products")
          .delete()
          .neq("id", 0)
          .neq("id", -99);

        if (deleteError) {
          throw new Error(`Failed to clear existing products: ${deleteError.message}`);
        }

        // Insert new products in batches
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

        console.log(`Successfully imported ${products.length} products.`);
        return NextResponse.json({ success: true, count: products.length, source: "supabase" });
      } catch (dbErr: any) {
        console.error("Supabase import failed, falling back to local file:", dbErr);
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
