import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseClient";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    const { data: orderRow, error } = await supabaseAdmin
      .from("products")
      .select("description")
      .eq("id", -99)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore single-row-not-found error code
      throw error;
    }

    let orders: any[] = [];
    if (orderRow && orderRow.description) {
      try {
        orders = JSON.parse(orderRow.description);
      } catch (e) {
        orders = [];
      }
    }

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: err.message || "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updatedOrders = await req.json();
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    if (!Array.isArray(updatedOrders)) {
      return NextResponse.json({ error: "Invalid orders data format" }, { status: 400 });
    }

    const { error: upsertError } = await supabaseAdmin
      .from("products")
      .upsert({
        id: -99,
        name: "__ORDERS_DATA__",
        description: JSON.stringify(updatedOrders),
        category: "orders",
        categoryName: "الطلبات",
        brand: "orders",
        model: "orders",
        year: "all",
        price: 0,
        image: "",
        featured: false,
        bestSeller: false,
        newArrival: false
      });

    if (upsertError) {
      throw upsertError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving orders:", err);
    return NextResponse.json({ error: err.message || "Failed to save orders" }, { status: 500 });
  }
}
