"use client";

import { useState } from "react";
import type { Toast } from "../model";

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(title: string, detail: string) {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((current) => [...current, { id, title, detail }].slice(-4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }

  return { toasts, showToast };
}
