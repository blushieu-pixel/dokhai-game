"use client";

import { useCartContext } from "@/contexts/CartContext";

export default function useCart() {
  return useCartContext();
}