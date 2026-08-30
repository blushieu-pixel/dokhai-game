"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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

export default function ProductGrid({ selectedGame }: { selectedGame?: string }) {
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

  const filteredProducts =
    selectedGame && selectedGame !== "Tất cả"
      ? products.filter((p) => p.game === selectedGame)
      : products;

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 font-bold">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-medium">
        Chưa có sản phẩm nào được đăng.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
        >
          <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
            {product.tag && (
              <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {product.tag}
              </span>
            )}
            <img
              src={product.image || "/logo.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {product.game}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1 line-clamp-2">
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

              <Link
                href={`/product/${product.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}