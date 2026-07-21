import { productsData, Product } from "../data/products";
import { supabase } from "./supabaseClient";

export async function getProductsList(): Promise<Product[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && supabase) {
    try {
      let allData: any[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            from += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      if (allData.length > 0) {
        // Map any field conversions if database has minor differences
        return allData.map((item: any) => ({
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
     } catch (err) {
      console.warn("Failed to fetch from Supabase, using local fallback:", err);
    }
  }

  // Local fallback logic
  return [...productsData];
}
