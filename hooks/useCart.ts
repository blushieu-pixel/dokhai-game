"use client";

import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  game: string;
  price: number;
  quantity: number;
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("dokhai-cart");

    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dokhai-cart", JSON.stringify(cart));
  }, [cart]);

  function addItem(item: Omit<CartItem, "quantity">) {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function increase(id: string) {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  }

  function decrease(id: string) {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    cart,
    total,
    addItem,
    removeItem,
    increase,
    decrease,
  };
}