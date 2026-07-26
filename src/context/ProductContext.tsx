"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { productsData, Product } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";

interface ProductContextType {
  products: Product[];
  categorySettings: Record<string, string>;
  brandSettings: Record<string, string>;
  modelSettings: Record<string, string>;
  importProducts: (newProducts: Product[]) => void;
  resetProducts: () => void;
  saveCategorySettings: (settings: { categories?: Record<string, string>; brands?: Record<string, string>; models?: Record<string, string> }) => Promise<boolean>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorySettings, setCategorySettings] = useState<Record<string, string>>({});
  const [brandSettings, setBrandSettings] = useState<Record<string, string>>({});
  const [modelSettings, setModelSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instantly load from localStorage or static files to populate the UI
    let initialProducts: Product[] = [];
    let initialCats: Record<string, string> = {};
    let initialBrs: Record<string, string> = {};
    let initialMdls: Record<string, string> = {};

    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("aljarhee_imported_products");
      const localCats = localStorage.getItem("aljarhee_category_settings");
      const localBrs = localStorage.getItem("aljarhee_brand_settings");
      const localMdls = localStorage.getItem("aljarhee_model_settings");

      if (localCats) { try { initialCats = JSON.parse(localCats); } catch (e) {} }
      if (localBrs) { try { initialBrs = JSON.parse(localBrs); } catch (e) {} }
      if (localMdls) { try { initialMdls = JSON.parse(localMdls); } catch (e) {} }

      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          initialProducts = parsed.filter((p: any) => p.id > 0);
          const settingsProduct = parsed.find((p: any) => p.id === 0);
          if (settingsProduct && settingsProduct.description && Object.keys(initialCats).length === 0) {
            try {
              const parsedSettings = JSON.parse(settingsProduct.description);
              initialCats = parsedSettings.categories || {};
              initialBrs = parsedSettings.brands || {};
              initialMdls = parsedSettings.models || {};
            } catch (e) {}
          }
        } catch (e) {}
      }
    }

    // Fallback to static JSON if localStorage is empty
    if (initialProducts.length === 0) {
      const staticImported = importedProductsStatic as Product[];
      if (staticImported && staticImported.length > 0) {
        initialProducts = staticImported.filter((p: any) => p.id > 0);
        const settingsProduct = staticImported.find((p: any) => p.id === 0);
        if (settingsProduct && settingsProduct.description && Object.keys(initialCats).length === 0) {
          try {
            const parsedSettings = JSON.parse(settingsProduct.description);
            initialCats = parsedSettings.categories || {};
            initialBrs = parsedSettings.brands || {};
            initialMdls = parsedSettings.models || {};
          } catch (e) {}
        }
      } else {
        initialProducts = productsData;
      }
    }

    // Set state immediately
    setProducts(initialProducts);
    setCategorySettings(initialCats);
    setBrandSettings(initialBrs);
    setModelSettings(initialMdls);
    setLoading(false); // Instantly turn off loading spinner!

    // 2. Fetch fresh live data from database silently in the background
    async function syncDatabaseInBackground() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const realProducts = data.filter((p: any) => p.id > 0);
            const settingsProduct = data.find((p: any) => p.id === 0);
            
            setProducts(realProducts);
            localStorage.setItem("aljarhee_imported_products", JSON.stringify(data));

            if (settingsProduct && settingsProduct.description) {
              try {
                const parsed = JSON.parse(settingsProduct.description);
                const cats = parsed.categories || {};
                const brs = parsed.brands || {};
                const mdls = parsed.models || {};
                
                setCategorySettings(cats);
                setBrandSettings(brs);
                setModelSettings(mdls);

                localStorage.setItem("aljarhee_category_settings", JSON.stringify(cats));
                localStorage.setItem("aljarhee_brand_settings", JSON.stringify(brs));
                localStorage.setItem("aljarhee_model_settings", JSON.stringify(mdls));
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.warn("Background db sync failed:", err);
      }
    }

    syncDatabaseInBackground();
  }, []);

  const importProducts = (newProducts: Product[]) => {
    localStorage.setItem("aljarhee_imported_products", JSON.stringify(newProducts));
    const realProducts = newProducts.filter((p) => p.id > 0);
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
    localStorage.removeItem("aljarhee_brand_settings");
    localStorage.removeItem("aljarhee_model_settings");
    setProducts(productsData);
    setCategorySettings({});
    setBrandSettings({});
    setModelSettings({});

    // Clear server API data
    fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    }).catch((err) => console.warn("Failed to reset products via API:", err));
  };

  const saveCategorySettings = async (settings: { categories?: Record<string, string>; brands?: Record<string, string>; models?: Record<string, string> }) => {
    const cats = settings.categories || categorySettings;
    const brs = settings.brands || brandSettings;
    const mdls = settings.models || modelSettings;

    setCategorySettings(cats);
    setBrandSettings(brs);
    setModelSettings(mdls);

    localStorage.setItem("aljarhee_category_settings", JSON.stringify(cats));
    localStorage.setItem("aljarhee_brand_settings", JSON.stringify(brs));
    localStorage.setItem("aljarhee_model_settings", JSON.stringify(mdls));

    const payload = {
      categories: cats,
      brands: brs,
      models: mdls
    };

    try {
      const res = await fetch("/api/admin/category-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn("Failed to persist category settings via API:", err);
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ products, categorySettings, brandSettings, modelSettings, importProducts, resetProducts, saveCategorySettings, loading }}>
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
