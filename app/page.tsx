"use client";

import Hero from "@/components/Hero";
import GameHub from "@/components/GameHub";
import FlashSale from "@/components/FlashSale";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <GameHub />
      <FlashSale />
      <ProductGrid />
    </div>
  );
}