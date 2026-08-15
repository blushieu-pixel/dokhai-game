
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Plus, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  game: string;
  rarity: string;
  price: number;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
        >
          <ArrowLeft size={18} />
          Quay lại Admin
        </Link>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Quản lý sản phẩm
            </h1>

            <p className="text-slate-500 mt-2">
              Tổng cộng {products.length} sản phẩm.
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
            <Plus size={20} />
            Thêm sản phẩm
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            <Package size={40} className="mx-auto text-slate-400 mb-4" />

            <h3 className="text-xl font-bold text-slate-700">
              Chưa có sản phẩm
            </h3>

            <p className="text-slate-500 mt-2">
              Firestore sẽ hiển thị sản phẩm tại đây.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-blue-600 font-semibold">
                      {item.game}
                    </div>

                    <h3 className="text-2xl font-black mt-2">
                      {item.name}
                    </h3>
                  </div>

                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {item.rarity}
                  </span>
                </div>

                <div className="mt-6 space-y-2 text-slate-600">
                  <div>
                    Giá:
                    <span className="font-bold text-blue-600 ml-2">
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div>
                    Kho:
                    <span className="font-bold ml-2">
                      {item.stock}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl font-semibold">
                    Sửa
                  </button>

                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl font-semibold">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}