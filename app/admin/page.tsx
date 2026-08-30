"use client";

import { useState } from "react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import {
  Search,
  Wallet,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const CATEGORIES = [
  "Tất cả",
  "Grow a Garden 2",
  "Steal a Brainrot",
  "Blox Fruits",
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-8 pt-6">
        
        {/* BANNER CHÍNH & NÚT THAO TÁC NHANH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-2 z-10">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Shop Game Uy Tín #1
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                Vật Phẩm Roblox <br /> Nhanh - An Toàn - Giá Rẻ
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 z-10">
              <button
                onClick={() => {
                  const el = document.getElementById("product-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-blue-600 hover:bg-slate-100 font-extrabold px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 text-sm"
              >
                Mua Ngay
              </button>
              <Link
                href="/wallet"
                className="bg-blue-700/60 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl border border-white/20 transition text-sm flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" /> Nạp Ví Cá Nhân
              </Link>
            </div>
          </div>

          {/* THẺ TÍNH NĂNG NHANH */}
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/wallet"
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition">
                    Ví Tiền Cá Nhân
                  </h4>
                  <p className="text-xs text-slate-400">Kiểm tra số dư & nạp tiền</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    Lịch Sử Đơn Hàng
                  </h4>
                  <p className="text-xs text-slate-400">Theo dõi trạng thái giao hàng</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* THANH TÌM KIẾM & BỘ LỌC DANH MỤC */}
        <div id="product-section" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-7 h-7 text-blue-600" /> Danh Mục Sản Phẩm
            </h2>

            {/* Ô TÌM KIẾM TƯƠNG TÁC */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm vật phẩm, acc..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              />
            </div>
          </div>

          {/* NÚT CHỌN DANH MỤC GAME (BẤM ĐƯỢC 100%) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-blue-500/25 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM HIỂN THỊ THEO BỘ LỌC */}
        <ProductGrid
          selectedGame={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}