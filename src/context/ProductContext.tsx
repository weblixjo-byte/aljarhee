"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { productsData, Product } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";

interface ProductContextType {
  products: Product[];
  importProducts: (newProducts: Product[]) => void;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Determine the initial products
    const localData = localStorage.getItem("aljarhee_imported_products");
    if (localData) {
      try {
        setProducts(JSON.parse(localData));
        return;
      } catch (e) {
        console.error("Failed to parse local storage products:", e);
      }
    }

    // Fallback to imported_products.json if populated, otherwise static productsData
    const staticImported = importedProductsStatic as Product[];
    if (staticImported && staticImported.length > 0) {
      setProducts(staticImported);
    } else {
      setProducts(productsData);
    }
  }, []);

  const importProducts = (newProducts: Product[]) => {
    localStorage.setItem("aljarhee_imported_products", JSON.stringify(newProducts));
    setProducts(newProducts);

    // Call server API to persist on disk (works in development)
    fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProducts),
    }).catch((err) => console.warn("Failed to write import to server disk:", err));
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
    }).catch((err) => console.warn("Failed to clear import on server disk:", err));
  };

  return (
    <ProductContext.Provider value={{ products, importProducts, resetProducts }}>
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
