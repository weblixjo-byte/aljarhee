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

    // 4. Send Notifications (Pushover + Web3Forms Email) if configured
    try {
      const pushoverToken = process.env.PUSHOVER_TOKEN || "";
      const pushoverUser = process.env.PUSHOVER_USER || "";
      const web3formsKey = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "8c7551cf-f507-4dec-b670-4383097ee4cb";

      console.log(`[Checkout] web3formsKey present: ${!!web3formsKey}, pushover present: ${!!(pushoverToken && pushoverUser)}`);

      const itemsSummary = newOrder.cartItems
        .map((item: any) => `- ${item.name} (x${item.quantity}) - ${item.price} JD`)
        .join("\n");

      // 4a. Pushover notification
      if (pushoverToken && pushoverUser) {
        const itemsSummaryShort = newOrder.cartItems
          .map((item: any) => `* ${item.name} (${item.quantity}x)`)
          .join("\n");

        const msgText = `New order worth ${newOrder.total} JD!\n\n` +
                        `Customer: ${newOrder.customerName}\n` +
                        `Phone: ${newOrder.customerPhone}\n` +
                        `Address: ${newOrder.customerCity} - ${newOrder.customerAddress}\n\n` +
                        `Items:\n${itemsSummaryShort}`;

        const pushRes = await fetch("https://api.pushover.net/1/messages.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: pushoverToken,
            user: pushoverUser,
            title: `New Order ${newOrder.id}`,
            message: msgText,
            priority: 1,
            sound: "onload",
          }),
        });
        console.log(`[Checkout] Pushover response: ${pushRes.status}`);
      }

      // 4b. Web3Forms email notification
      if (web3formsKey) {
        const emailBody = [
          `Order ID: ${newOrder.id}`,
          ``,
          `Customer Name: ${newOrder.customerName}`,
          `Phone: ${newOrder.customerPhone}`,
          `City: ${newOrder.customerCity}`,
          `Address: ${newOrder.customerAddress}`,
          ``,
          `Items Ordered:`,
          itemsSummary,
          ``,
          `Subtotal: ${newOrder.subtotal} JD`,
          `Shipping: ${newOrder.shippingFee} JD`,
          `Total: ${newOrder.total} JD`,
          ``,
          `Order Time: ${new Date(newOrder.createdAt).toISOString()}`,
        ].join("\n");

        const w3fRes = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New Order ${newOrder.id} - ${newOrder.customerName} - ${newOrder.total} JD`,
            from_name: "Aljarhee Store - New Order Alert",
            message: emailBody,
          }),
        });

        const w3fJson = await w3fRes.json().catch(() => ({}));
        console.log(`[Checkout] Web3Forms response: ${w3fRes.status}`, JSON.stringify(w3fJson));

        if (!w3fRes.ok) {
          console.error("[Checkout] Web3Forms email FAILED:", w3fJson);
        } else {
          console.log("[Checkout] Web3Forms order email sent successfully.");
        }
      } else {
        console.warn("[Checkout] web3formsKey is empty — no email notification sent.");
      }
    } catch (notifyErr) {
      console.warn("[Checkout] Notification failed, but order was saved:", notifyErr);
    }

    return NextResponse.json({ success: true, orderId: orderIdString });
  } catch (err: any) {
    console.error("Error in checkout route:", err);
    return NextResponse.json({ error: err.message || "Failed to process checkout" }, { status: 500 });
  }
}
