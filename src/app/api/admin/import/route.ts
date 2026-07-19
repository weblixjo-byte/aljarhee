import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const products = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data format" }, { status: 400 });
    }

    // Path to save the file
    const filePath = path.join(process.cwd(), "src", "data", "imported_products.json");

    // Write file to disk
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json({ success: true, count: products.length });
  } catch (err: any) {
    console.error("Error writing imported products file:", err);
    return NextResponse.json({ error: err.message || "Failed to persist products" }, { status: 500 });
  }
}
