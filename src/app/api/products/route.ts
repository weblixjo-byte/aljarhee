import { NextResponse } from "next/server";
import { getProductsList } from "../../../lib/productsApi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProductsList();
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("Error in products API route:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load products" },
      { status: 500 }
    );
  }
}
