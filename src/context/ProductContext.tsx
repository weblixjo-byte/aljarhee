"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { productsData, Product } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";

interface ProductContextType {
  products: Product[];
  categorySettings: Record<string, string>;
  importProducts: (newProducts: Product[]) => void;
  resetProducts: () => void;
  saveCategorySettings: (settings: Record<string, string>) => Promise<boolean>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorySettings, setCategorySettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      // Load local storage category settings immediately for quick UI response
      const localSettings = localStorage.getItem("aljarhee_category_settings");
      if (localSettings) {
        try {
          setCategorySettings(JSON.parse(localSettings));
        } catch (e) {
          console.warn("Failed to parse category settings from localStorage:", e);
        }
      }

      try {
        // 1. Try fetching from live database API (Supabase route)
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const realProducts = data.filter((p: any) => p.id !== 0);
            const settingsProduct = data.find((p: any) => p.id === 0);
            if (settingsProduct && settingsProduct.description) {
              try {
                const parsedSettings = JSON.parse(settingsProduct.description);
                setCategorySettings(parsedSettings);
                localStorage.setItem("aljarhee_category_settings", JSON.stringify(parsedSettings));
              } catch (e) {
                console.error("Failed to parse database category settings:", e);
              }
            }
            setProducts(realProducts);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live products from API, falling back:", err);
      }

      // 2. Local fallback if API is not active or empty
      const localData = localStorage.getItem("aljarhee_imported_products");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const realProducts = parsed.filter((p: any) => p.id !== 0);
          const settingsProduct = parsed.find((p: any) => p.id === 0);
          if (settingsProduct && settingsProduct.description) {
            try {
              setCategorySettings(JSON.parse(settingsProduct.description));
            } catch (e) {
              console.error("Failed to parse category settings from local storage:", e);
            }
          }
          setProducts(realProducts);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse local storage products:", e);
        }
      }

      // 3. Static fallback
      const staticImported = importedProductsStatic as Product[];
      if (staticImported && staticImported.length > 0) {
        const realProducts = staticImported.filter((p: any) => p.id !== 0);
        const settingsProduct = staticImported.find((p: any) => p.id === 0);
        if (settingsProduct && settingsProduct.description) {
          try {
            setCategorySettings(JSON.parse(settingsProduct.description));
          } catch (e) {
            console.error("Failed to parse static category settings:", e);
          }
        }
        setProducts(realProducts);
      } else {
        setProducts(productsData);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  const importProducts = (newProducts: Product[]) => {
    localStorage.setItem("aljarhee_imported_products", JSON.stringify(newProducts));
    const realProducts = newProducts.filter((p) => p.id !== 0);
    setProducts(realProducts);

    // Call server API to persist (will write to Supabase or fallback to local disk)
    fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProducts),
    }).catch((err) => console.warn("Failed to persist products to API:", err));
  };

  const resetProducts = () => {
    localStorage.removeItem("aljarhee_imported_products");
    localStorage.removeItem("aljarhee_category_settings");
    setProducts(productsData);
    setCategorySettings({});

    // Clear server API data
    fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    }).catch((err) => console.warn("Failed to reset products via API:", err));
  };

  const saveCategorySettings = async (settings: Record<string, string>) => {
    setCategorySettings(settings);
    localStorage.setItem("aljarhee_category_settings", JSON.stringify(settings));
    try {
      const res = await fetch("/api/admin/category-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      return res.ok;
    } catch (err) {
      console.warn("Failed to persist category settings via API:", err);
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ products, categorySettings, importProducts, resetProducts, saveCategorySettings, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
