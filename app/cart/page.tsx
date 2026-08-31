"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, ArrowRight, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng:", e);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    // Lắng nghe sự kiện đồng bộ giỏ hàng tức thì trên di động
    window.addEventListener("storage", loadCart);
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" /> Giỏ Hàng Của Bạn
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-4">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Giỏ hàng đang trống</h2>
            <p className="text-xs text-slate-400">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-2xl transition shadow-md shadow-blue-500/20"
            >
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-2xl border border-slate-100 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                      <p className="text-xs font-black text-blue-600">
                        {(item.price || 0).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-slate-600 font-black hover:bg-slate-200 rounded-l-xl"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-slate-600 font-black hover:bg-slate-200 rounded-r-xl"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-base font-black">
                <span className="text-slate-700">Tổng thanh toán:</span>
                <span className="text-red-600 text-xl">{totalAmount.toLocaleString("vi-VN")}đ</span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                Tiến hành thanh toán <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}