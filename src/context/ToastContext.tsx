"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toasts Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in-left bg-white ${
              toast.type === "success"
                ? "border-brand-green/20 text-text-primary"
                : toast.type === "error"
                ? "border-red-200 text-red-950"
                : "border-yellow-200 text-yellow-950"
            }`}
          >
            {/* Icon */}
            {toast.type === "success" && (
              <CheckCircle2 className="text-brand-green shrink-0 mt-0.5" size={20} />
            )}
            {toast.type === "error" && (
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            )}
            {toast.type === "warning" && (
              <AlertTriangle className="text-brand-yellow shrink-0 mt-0.5" size={20} />
            )}

            {/* Message */}
            <p className="flex-1 text-xs font-extrabold leading-relaxed text-right">
              {toast.message}
            </p>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
