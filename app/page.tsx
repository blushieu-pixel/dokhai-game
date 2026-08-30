"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import { db } from "@/lib/firebase";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import {
  Search,
  Zap,
  ShoppingCart,
  Clock,
  ArrowRight,
  Sparkles,
  Gamepad2
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  game: string;
  price: number;
  oldPrice?: number;
  stock: number;
  tag?: string;
  image: string;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [flashProducts, setFlashProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 52 });

  // Tải danh sách sản phẩm Flash Sale từ Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setFlashProducts(list);
    });
    return () => unsubscribe();
  }, []);

  // Đếm ngược thời gian Flash Sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý bấm chọn Danh Mục Game
  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    const el = document.getElementById("product-grid-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Thêm trực tiếp vào giỏ hàng LocalStorage
  const handleAddToCart = (product: Product) => {
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
      } else {
        currentCart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("storage"));
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-10 pt-6">

        {/* 1. HERO BANNER CHÍNH */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[280px]">
          <div className="space-y-4 z-10">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Shop Roblox uy tín
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              DoKhai's <br /> Shop
            </h1>
            <p className="text-blue-100 text-sm max-w-md">
              Chuyên Grow a Garden 2 và Steal a Brainrot. Mua vật phẩm nhanh chóng, giao hàng uy tín và hỗ trợ 24/7.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  document.getElementById("product-grid-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 text-sm"
              >
                Mua ngay
              </button>
              <button
                onClick={() => {
                  document.getElementById("product-grid-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl border border-white/20 transition text-sm"
              >
                Xem sản phẩm
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end z-10">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-black">
              <img
                src="/logo.png"
                alt="Hero Banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2. DANH MỤC GAME (BẤM VÀO ĐỂ TỰ ĐỘNG LỌC SẢN PHẨM) */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-600" /> Danh Mục Game
            </h2>
            <p className="text-xs text-slate-400">Chọn game bạn muốn mua vật phẩm hoặc tài khoản</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Tất cả", label: "Tất cả vật phẩm", icon: "💎" },
              { name: "Grow a Garden 2", label: "Grow a Garden 2", icon: "🌱" },
              { name: "Steal a Brainrot", label: "Steal a Brainrot", icon: "🔥" },
              { name: "Blox Fruits", label: "Acc Blox Fruits", icon: "⚔️" },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  selectedCategory === cat.name
                    ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xl">{cat.icon}</span>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">
                    {cat.label}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* 3. KHU VỰC FLASH SALE */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-red-500 text-white p-2 rounded-xl animate-bounce">
                <Zap className="w-5 h-5 fill-current" />
              </span>
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">Flash Sale</h3>
                <p className="text-xs text-blue-100">Giá sốc trong thời gian giới hạn</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-mono font-bold">
              <Clock className="w-4 h-4 text-yellow-300 mr-1" />
              <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, "0")}</span>:
              <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, "0")}</span>:
              <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, "0")}</span>
            </div>
          </div>

          {flashProducts.length === 0 ? (
            <div className="text-center py-8 text-blue-200 text-sm font-medium">Đang tải Flash Sale...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {flashProducts.map((p) => (
                <div key={p.id} className="bg-white text-slate-800 rounded-2xl p-3 space-y-3 shadow-md relative overflow-hidden group">
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                    </span>
                  )}
                  <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative">
                    <img src={p.image || "/logo.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">{p.game}</span>
                    <h4 className="font-bold text-xs line-clamp-1">{p.name}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-blue-600 font-black text-sm">{p.price?.toLocaleString("vi-VN")}đ</span>
                        {p.oldPrice && <p className="text-[10px] text-slate-400 line-through">{p.oldPrice.toLocaleString("vi-VN")}đ</p>}
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition shadow"
                        title="Thêm vào giỏ"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. TÌM KIẾM VÀ DANH SÁCH SẢN PHẨM HOÀN CHỈNH */}
        <div id="product-grid-section" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1.5 rounded-xl border border-blue-100">
                {selectedCategory}
              </span>
              <span className="text-xs text-slate-400">Đang hiển thị sản phẩm theo lựa chọn</span>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên vật phẩm, acc..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <ProductGrid selectedGame={selectedCategory} searchQuery={searchQuery} />
        </div>

      </div>
    </main>
  );
}