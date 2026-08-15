"use client";
import { db } from "@/lib/firebase";
import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import FlashSale from "@/components/FlashSale";
import GameHub from "@/components/GameHub";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [filter, setFilter] = useState("all");
  return (
    <main className="min-h-screen bg-slate-50">
      
      <Hero />
      <GameHub />
      <FlashSale />
      <ProductGrid />
      <BottomNav />
    </main>
  );
}