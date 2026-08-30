import { supabase } from "./supabaseClient";

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  cartItems: any[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export async function submitCheckoutOrder(orderData: CheckoutPayload): Promise<{ success: boolean; orderId: string }> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  // 1. Fetch current orders from row id: -99
  const { data: orderRow } = await supabase
    .from("products")
    .select("description")
    .eq("id", -99)
    .maybeSingle();

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
    const maxId = Math.max(
      ...currentOrders.map((o: any) => {
        const num = parseInt(String(o.id).replace("OR-", ""));
        return isNaN(num) ? 0 : num;
      })
    );
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
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...currentOrders];

  // 3. Save updated orders back to id: -99
  const { error: upsertError } = await supabase
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
      newArrival: false,
    });

  if (upsertError) {
    throw upsertError;
  }

  // 4. Send Notifications (Pushover + Web3Forms Email)
  try {
    let pushoverToken = process.env.NEXT_PUBLIC_PUSHOVER_TOKEN || "axtm2hzx578kgysafbbbf1t5fthyr2";
    let pushoverUser = process.env.NEXT_PUBLIC_PUSHOVER_USER || "u59f2g8pgaroorng3rfaf2vfn6hwij";
    let web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "8c7551cf-f507-4dec-b670-4383097ee4cb";

    const { data: settingsRow } = await supabase
      .from("products")
      .select("description")
      .eq("id", 0)
      .maybeSingle();

    if (settingsRow && settingsRow.description) {
      try {
        const settings = JSON.parse(settingsRow.description);
        if (settings.pushoverToken) pushoverToken = settings.pushoverToken;
        if (settings.pushoverUser) pushoverUser = settings.pushoverUser;
        if (settings.web3formsKey) web3formsKey = settings.web3formsKey;
      } catch (e) {}
    }

    const itemsSummary = newOrder.cartItems
      .map((item: any) => `- ${item.name} (x${item.quantity}) - ${item.price} JD`)
      .join("\n");

    // 4a. Pushover notification
    if (pushoverToken && pushoverUser) {
      const itemsSummaryShort = newOrder.cartItems
        .map((item: any) => `* ${item.name} (${item.quantity}x)`)
        .join("\n");

      const msgText =
        `New order worth ${newOrder.total} JD!\n\n` +
        `Customer: ${newOrder.customerName}\n` +
        `Phone: ${newOrder.customerPhone}\n` +
        `Address: ${newOrder.customerCity} - ${newOrder.customerAddress}\n\n` +
        `Items:\n${itemsSummaryShort}`;

      fetch("https://api.pushover.net/1/messages.json", {
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
      }).catch((e) => console.warn("Pushover notification failed silently:", e));
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

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `New Order ${newOrder.id} - ${newOrder.customerName} - ${newOrder.total} JD`,
          from_name: "Aljarhee Store - New Order Alert",
          message: emailBody,
        }),
      }).catch((e) => console.warn("Web3Forms email failed silently:", e));
    }
  } catch (notifyErr) {
    console.warn("Notification failed, but order was saved:", notifyErr);
  }

  return { success: true, orderId: orderIdString };
}
