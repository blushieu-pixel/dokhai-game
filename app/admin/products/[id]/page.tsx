"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", game: "", price: 0, tag: "" });

  useEffect(() => {
    getDoc(doc(db, "products", id)).then((d) => d.exists() && setForm(d.data() as any));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "products", id), { ...form, price: Number(form.price) });
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-2xl bg-white p-6 rounded-2xl border space-y-4 shadow-sm">
      <h1 className="text-xl font-bold text-slate-800">Chỉnh Sửa Sản Phẩm</h1>
      <input
        className="w-full border p-3 rounded-xl text-sm outline-none"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full border p-3 rounded-xl text-sm outline-none"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700">
        Cập Nhật
      </button>
    </form>
  );
}