import { NextResponse } from "next/server";
import { getProductsList } from "../../../lib/productsApi";

export const revalidate = 3600; // 1 hour edge cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isBypass = searchParams.has("t") || searchParams.has("admin");

    const products = await getProductsList();
    return new NextResponse(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": isBypass
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        "Netlify-CDN-Cache-Control": isBypass
          ? "no-store"
          : "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("Error in products API route:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load products" },
      { status: 500 }
    );
  }
}
