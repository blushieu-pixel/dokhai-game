"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", game: "Grow a Garden 2", price: "", stock: "10", tag: "HOT" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      createdAt: serverTimestamp(),
    });
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-2xl border space-y-4 shadow-sm">
      <h1 className="text-xl font-bold text-slate-800">Thêm Sản Phẩm Mới</h1>
      <input
        className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tên sản phẩm"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border p-3 rounded-xl text-sm outline-none"
          value={form.game}
          onChange={(e) => setForm({ ...form, game: e.target.value })}
        >
          <option value="Grow a Garden 2">Grow a Garden 2</option>
          <option value="Steal a Brainrot">Steal a Brainrot</option>
          <option value="Blox Fruits">Blox Fruits</option>
        </select>
        <input
          className="border p-3 rounded-xl text-sm outline-none"
          placeholder="Tag (HOT, VIP...)"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        />
      </div>
      <input
        className="w-full border p-3 rounded-xl text-sm outline-none"
        type="number"
        placeholder="Giá bán (VNĐ)"
        required
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700">
        Lưu Sản Phẩm
      </button>
    </form>
  );
}