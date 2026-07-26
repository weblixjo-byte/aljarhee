export interface Product {
  id: number;
  name: string;
  category: string;
  categoryName?: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  originalPrice?: number;
  condition: string;
  conditionText: string;
  image: string;
  description: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
}

export const productsData: Product[] = [];

export function getProductCategory(product: Product): "mechanical" | "body" | "lights" {
  const name = (product.name || "").toLowerCase();
  
  // 1. Check Lights (اضوية)
  const isLights = 
    product.category === "lights" ||
    name.includes("ضوء") || 
    name.includes("اضوء") || 
    name.includes("أضواء") || 
    name.includes("لمبة") || 
    name.includes("لمبات") || 
    name.includes("كشاف") || 
    name.includes("كشافات") || 
    name.includes("زينون") || 
    name.includes("فانوس") || 
    name.includes("فوانيس") || 
    name.includes("ليد") || 
    name.includes("led");
  if (isLights) return "lights";

  // 2. Check Body & Structure (الهيكل والبودي)
  const isBody = 
    product.category === "body" ||
    name.includes("طبون") || 
    name.includes("طمبون") || 
    name.includes("صدام") || 
    name.includes("غطاء") || 
    name.includes("غطا") || 
    name.includes("خلفي") || 
    name.includes("امامي") || 
    name.includes("مرايا") || 
    name.includes("مريا") || 
    name.includes("رفرف") || 
    name.includes("باب") || 
    name.includes("ابواب") || 
    name.includes("جناح") || 
    name.includes("شبك") || 
    name.includes("بودي") || 
    name.includes("هيكل") || 
    name.includes("فخذة") || 
    name.includes("شنطة") || 
    name.includes("صندوق") || 
    name.includes("بطانة") || 
    name.includes("دعمة") || 
    name.includes("بطانه");
  if (isBody) return "body";

  // 3. Default to Mechanical (محركات)
  return "mechanical";
}
