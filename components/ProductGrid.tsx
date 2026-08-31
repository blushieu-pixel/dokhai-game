"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ShoppingCart, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  game?: string;
  category?: string;
}

interface ProductGridProps {
  selectedGame?: string;
  searchQuery?: string;
}

export default function ProductGrid({
  selectedGame = "Tất cả",
  searchQuery = "",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Lấy dữ liệu sản phẩm từ Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Product[];
      setProducts(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Xử lý thêm vào giỏ hàng & đồng bộ thiết bị di động
  const handleAddToCart = (product: Product) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
      } else {
        currentCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));

      // Phát sự kiện đồng bộ tức thì trên điện thoại
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));

      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
    }
  };

  // Lọc sản phẩm theo danh mục game và từ khóa tìm kiếm
  const filteredProducts = products.filter((item) => {
    const matchGame =
      !selectedGame ||
      selectedGame === "Tất cả" ||
      item.game === selectedGame ||
      item.category === selectedGame;

    const matchSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchGame && matchSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-400 font-bold text-sm">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 font-bold text-sm bg-white rounded-3xl border border-slate-200">
        Không tìm thấy sản phẩm nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group"
        >
          <div className="space-y-2">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-xs">
                  No Image
                </div>
              )}
            </div>

            <div>
              {product.game && (
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {product.game}
                </span>
              )}
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mt-1">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
            <span className="font-black text-red-600 text-xs sm:text-sm">
              {product.price?.toLocaleString("vi-VN")}đ
            </span>

            <button
              onClick={() => handleAddToCart(product)}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                addedId === product.id
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
              }`}
            >
              {addedId === product.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đã thêm</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thêm</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}