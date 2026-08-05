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
        "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=60",
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
