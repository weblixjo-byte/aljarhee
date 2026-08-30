import { supabase } from "./supabaseClient";

// 1. Fetch Orders from Supabase row id: -99
export async function fetchAdminOrders(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data: orderRow } = await supabase
      .from("products")
      .select("description")
      .eq("id", -99)
      .maybeSingle();

    if (orderRow && orderRow.description) {
      try {
        return JSON.parse(orderRow.description);
      } catch (e) {
        return [];
      }
    }
  } catch (e) {
    console.warn("Failed to fetch admin orders:", e);
  }
  return [];
}

// 2. Save Updated Orders Array to Supabase row id: -99
export async function saveAdminOrders(orders: any[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("products")
      .upsert({
        id: -99,
        name: "__ORDERS_DATA__",
        description: JSON.stringify(orders),
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
    return !error;
  } catch (e) {
    console.warn("Failed to save admin orders:", e);
    return false;
  }
}

// 3. Save Category / Brand / Model Settings to Supabase row id: 0
export async function saveCategorySettings(categories: any, brands: any, models: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const settingsPayload = {
      categories,
      brands,
      models,
    };

    const { error } = await supabase
      .from("products")
      .upsert({
        id: 0,
        name: "__CATEGORY_SETTINGS__",
        description: JSON.stringify(settingsPayload),
        category: "settings",
        categoryName: "إعدادات",
        brand: "settings",
        model: "settings",
        year: "all",
        price: 0,
        image: "",
        featured: false,
        bestSeller: false,
        newArrival: false,
      });

    return !error;
  } catch (e) {
    console.warn("Failed to save category settings:", e);
    return false;
  }
}

// 4. Save Products Batch Import to Supabase
export async function saveProductsImport(productsList: any[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const cleanItems = productsList.map((item: any) => ({
      id: Number(item.id),
      name: String(item.name || "").trim(),
      category: String(item.category || "").trim(),
      categoryName: String(item.categoryName || item.category || "").trim(),
      brand: String(item.brand || "").trim(),
      model: String(item.model || "").trim(),
      year: String(item.year || "").trim(),
      price: Number(item.price) || 0,
      originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
      condition: String(item.condition || "new"),
      conditionText: String(item.conditionText || "جديد أسلي"),
      image: String(item.image || "").trim(),
      description: typeof item.description === "object" ? JSON.stringify(item.description) : String(item.description || ""),
      featured: Boolean(item.featured),
      bestSeller: Boolean(item.bestSeller),
      newArrival: Boolean(item.newArrival),
    }));

    // Chunk size 100
    const chunkSize = 100;
    for (let i = 0; i < cleanItems.length; i += chunkSize) {
      const chunk = cleanItems.slice(i, i + chunkSize);
      const { error } = await supabase.from("products").upsert(chunk);
      if (error) {
        console.error("Chunk upsert error:", error);
      }
    }
    return true;
  } catch (e) {
    console.warn("Failed to save products import:", e);
    return false;
  }
}
