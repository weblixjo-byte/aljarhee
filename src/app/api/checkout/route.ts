import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // 1. Fetch current orders from row id: -99
    const { data: orderRow, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("description")
      .eq("id", -99)
      .single();

    let currentOrders: any[] = [];
    if (orderRow && orderRow.description) {
      try {
        currentOrders = JSON.parse(orderRow.description);
      } catch (e) {
        currentOrders = [];
      }
    }

    // 2. Generate a new serial Order ID
    let nextOrderId = 1001;
    if (currentOrders.length > 0) {
      const maxId = Math.max(...currentOrders.map((o: any) => {
        const num = parseInt(String(o.id).replace("OR-", ""));
        return isNaN(num) ? 0 : num;
      }));
      nextOrderId = maxId >= 1001 ? maxId + 1 : 1001;
    }
    const orderIdString = `OR-${nextOrderId}`;

    const newOrder = {
      id: orderIdString,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerCity: orderData.customerCity,
      customerAddress: orderData.customerAddress,
      cartItems: orderData.cartItems,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      status: "pending", // pending, completed, cancelled
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...currentOrders]; // Newest orders first

    // 3. Save updated orders back to id: -99
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

    // 4. Send Pushover Notification if configured
    try {
      const { data: settingsRow } = await supabaseAdmin
        .from("products")
        .select("description")
        .eq("id", 0)
        .single();

      let pushoverToken = process.env.PUSHOVER_TOKEN || "";
      let pushoverUser = process.env.PUSHOVER_USER || "";

      if (settingsRow && settingsRow.description) {
        try {
          const parsed = JSON.parse(settingsRow.description);
          if (parsed.pushoverToken) pushoverToken = parsed.pushoverToken;
          if (parsed.pushoverUser) pushoverUser = parsed.pushoverUser;
        } catch (e) {}
      }

      if (pushoverToken && pushoverUser) {
        const itemsSummary = newOrder.cartItems
          .map((item: any) => `• ${item.name} (${item.quantity}x)`)
          .join("\n");

        const msgText = `طلب جديد بقيمة ${newOrder.total} د.أ!\n\n` +
                        `الزبون: ${newOrder.customerName}\n` +
                        `الهاتف: ${newOrder.customerPhone}\n` +
                        `العنوان: ${newOrder.customerCity} - ${newOrder.customerAddress}\n\n` +
                        `القطع المطلوبة:\n${itemsSummary}`;

        await fetch("https://api.pushover.net/1/messages.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: pushoverToken,
            user: pushoverUser,
            title: `طلب جديد ${newOrder.id}`,
            message: msgText,
            priority: 1, // high priority
            sound: "onload",
          }),
        });
        console.log("Pushover notification triggered successfully.");
      }
    } catch (pushErr) {
      console.warn("Pushover notification failed, but order saved:", pushErr);
    }

    return NextResponse.json({ success: true, orderId: orderIdString });
  } catch (err: any) {
    console.error("Error in checkout route:", err);
    return NextResponse.json({ error: err.message || "Failed to process checkout" }, { status: 500 });
  }
}
