import { NextResponse } from "next/server";
import { getProductsList } from "../../../lib/productsApi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProductsList();
    return new NextResponse(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120, s-maxage=3600, stale-while-revalidate=86400",
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
