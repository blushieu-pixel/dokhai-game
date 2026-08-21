"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useCart from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, total } = useCart();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    robloxName: "",
    robloxUID: "",
    note: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        customer: form,
        items: cart,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      });

     router.push("/checkout/payment");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo đơn.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-black mb-2">
          Thanh toán
        </h1>

        <p className="text-slate-500 mb-8">
          Điền thông tin để giao vật phẩm Roblox.
        </p>

        <div className="bg-white rounded-3xl shadow p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="font-semibold block mb-2">
                Username Roblox
              </label>

              <input
                required
                value={form.robloxName}
                onChange={(e) =>
                  setForm({ ...form, robloxName: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="DoKhai123"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Roblox UID
              </label>

              <input
                required
                value={form.robloxUID}
                onChange={(e) =>
                  setForm({ ...form, robloxUID: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="123456789"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Ghi chú
              </label>

              <textarea
                rows={4}
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3 resize-none"
                placeholder="Ví dụ: Giao trong Grow a Garden..."
              />
            </div>

            <div className="bg-slate-100 rounded-2xl p-5">

              <div className="flex justify-between">

                <span>Tổng thanh toán</span>

                <span className="text-2xl font-black text-blue-600">
                  {total.toLocaleString("vi-VN")}đ
                </span>

              </div>

            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition disabled:opacity-60"
            >
              {loading ? "Đang tạo đơn..." : "Tạo đơn hàng"}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}