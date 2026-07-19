"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { productsData, Product } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";

interface ProductContextType {
  products: Product[];
  importProducts: (newProducts: Product[]) => void;
  resetProducts: () => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // 1. Try fetching from live database API (Supabase route)
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
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
          setProducts(JSON.parse(localData));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse local storage products:", e);
        }
      }

      // 3. Static fallback
      const staticImported = importedProductsStatic as Product[];
      if (staticImported && staticImported.length > 0) {
        setProducts(staticImported);
      } else {
        setProducts(productsData);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  const importProducts = (newProducts: Product[]) => {
    localStorage.setItem("aljarhee_imported_products", JSON.stringify(newProducts));
    setProducts(newProducts);

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
    setProducts(productsData);

    // Clear server API data
    fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    }).catch((err) => console.warn("Failed to reset products via API:", err));
  };

  return (
    <ProductContext.Provider value={{ products, importProducts, resetProducts, loading }}>
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
