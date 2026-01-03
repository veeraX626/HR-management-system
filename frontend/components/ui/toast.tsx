"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<{ push: (message: string) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const push = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Root open={open} onOpenChange={setOpen} className="rounded bg-black text-white px-4 py-3 shadow-lg">
          <ToastPrimitive.Title className="text-sm font-medium">{message}</ToastPrimitive.Title>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
