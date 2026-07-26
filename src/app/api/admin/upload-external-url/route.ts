import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid url parameter" }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // If it's already on our Supabase bucket or is a local asset, return it directly
    if (
      cleanUrl.includes("wohmrmlthkmxkebmupdn.supabase.co") ||
      cleanUrl.startsWith("/") ||
      cleanUrl.startsWith("data:") ||
      !cleanUrl.startsWith("http")
    ) {
      return NextResponse.json({ url: cleanUrl });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not initialized" }, { status: 500 });
    }

    console.log(`Downloading external image: ${cleanUrl}`);
    
    // Fetch image from external URL
    const imgRes = await fetch(cleanUrl);
    if (!imgRes.ok) {
      throw new Error(`Failed to fetch image from external URL (status: ${imgRes.status})`);
    }

    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine extension
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("svg")) ext = "svg+xml";

    const fileName = `settings/imported_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, buffer, {
        contentType,
        cacheControl: "31536000",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      throw new Error("Failed to retrieve public URL from Supabase storage");
    }

    console.log(`Successfully uploaded to Supabase: ${data.publicUrl}`);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error("Error uploading external image:", err);
    return NextResponse.json({ error: err.message || "Failed to process and host external image" }, { status: 500 });
  }
}
