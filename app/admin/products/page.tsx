"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Plus, Trash2, Edit3 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa sản phẩm này khỏi hệ thống?")) return;
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Quản Lý Sản Phẩm</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 border-b">
            <tr>
              <th className="p-4">Tên</th>
              <th className="p-4">Game</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-bold text-slate-800">{p.name}</td>
                <td className="p-4">{p.game}</td>
                <td className="p-4 text-rose-600 font-bold">{p.price?.toLocaleString("vi-VN")}đ</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/products/${p.id}`} className="p-2 text-slate-500 hover:text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-500 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}