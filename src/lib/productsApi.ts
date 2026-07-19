import { productsData, Product } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";
import { supabase } from "./supabaseClient";

export async function getProductsList(): Promise<Product[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map any field conversions if database has minor differences
        return data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          category: item.category,
          categoryName: item.categoryName,
          brand: item.brand,
          model: item.model,
          year: item.year,
          price: Number(item.price),
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          condition: item.condition,
          conditionText: item.conditionText,
          image: item.image,
          description: item.description,
          featured: Boolean(item.featured),
          bestSeller: Boolean(item.bestSeller),
          newArrival: Boolean(item.newArrival),
        })) as Product[];
      }

      if (error) {
        console.warn("Supabase query returned error, using local fallback:", error);
      }
    } catch (err) {
      console.warn("Failed to fetch from Supabase, using local fallback:", err);
    }
  }

  // Local fallback logic
  const allProducts = [...productsData];
  const staticImported = importedProductsStatic as Product[];

  if (staticImported && staticImported.length > 0) {
    staticImported.forEach((p) => {
      if (!allProducts.some((item) => item.id === p.id)) {
        allProducts.push(p);
      }
    });
  }

  return allProducts;
}
