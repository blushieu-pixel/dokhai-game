"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";

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

export default function ProductGrid({
  selectedGame,
  searchQuery = "",
}: {
  selectedGame?: string;
  searchQuery?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const filteredProducts = products.filter((p) => {
    const matchGame =
      !selectedGame || selectedGame === "Tất cả" || p.game === selectedGame;
    const matchSearch =
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.game?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGame && matchSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-500 font-bold animate-pulse">
        Đang tải danh sách vật phẩm...
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 font-medium">
        Không tìm thấy sản phẩm nào phù hợp.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group"
        >
          <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
            {product.tag && (
              <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Tag className="w-3 h-3" /> {product.tag}
              </span>
            )}
            <img
              src={product.image || "/logo.png"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {product.game}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1.5 line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="text-blue-600 font-black text-base">
                  {product.price?.toLocaleString("vi-VN")}đ
                </p>
                {product.oldPrice && product.oldPrice > product.price && (
                  <p className="text-slate-400 line-through text-xs">
                    {product.oldPrice.toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center"
                title="Thêm vào giỏ"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}