"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useCart from "@/hooks/useCart";
import { getCoupon, Coupon } from "@/hooks/useCoupons";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total } = useCart();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [form, setForm] = useState({
    robloxName: "",
    robloxUID: "",
    note: "",
  });

  // Tính số tiền được giảm
  const discount = coupon
    ? coupon.type === "percent"
      ? Math.round((total * coupon.value) / 100)
      : Math.min(coupon.value, total)
    : 0;

  // Tổng tiền sau giảm
  const finalTotal = Math.max(total - discount, 0);

  // Xử lý áp dụng mã giảm giá
  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      alert("Vui lòng nhập mã giảm giá.");
      return;
    }

    setCouponLoading(true);

    try {
      const found = await getCoupon(couponCode);

      if (!found) {
        alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        setCoupon(null);
      } else {
        setCoupon(found);
        alert(`Áp dụng mã ${found.id} thành công!`);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kiểm tra mã giảm giá.");
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  // Xử lý gỡ mã giảm giá
  function handleRemoveCoupon() {
    setCoupon(null);
    setCouponCode("");
  }

  // Tạo đơn hàng
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    setLoading(true);

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customer: form,
        items: cart,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        coupon: coupon
          ? {
              id: coupon.id,
              type: coupon.type,
              value: coupon.value,
            }
          : null,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      router.push(`/orders/${orderRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo đơn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-black mb-2">Thanh toán</h1>
        <p className="text-slate-500 mb-8">
          Điền thông tin để giao vật phẩm Roblox.
        </p>

        <div className="bg-white rounded-3xl shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div>
              <label className="font-semibold block mb-2">Username Roblox</label>
              <input
                required
                value={form.robloxName}
                onChange={(e) => setForm({ ...form, robloxName: e.target.value })}
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="DoKhai123"
              />
            </div>

            {/* ROBLOX UID */}
            <div>
              <label className="font-semibold block mb-2">Roblox UID</label>
              <input
                required
                value={form.robloxUID}
                onChange={(e) => setForm({ ...form, robloxUID: e.target.value })}
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="123456789"
              />
            </div>

            {/* GHI CHÚ */}
            <div>
              <label className="font-semibold block mb-2">Ghi chú</label>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full border rounded-2xl px-4 py-3 resize-none"
                placeholder="Ví dụ: Giao trong Grow a Garden..."
              />
            </div>

            {/* MÃ GIẢM GIÁ */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-lg">Mã giảm giá</h3>

              <div className="flex gap-2 mt-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    // Ngăn chặn Enter gửi Form, đổi thành kích hoạt kiểm tra mã
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 border rounded-xl px-4 py-3 uppercase"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-60 hover:bg-slate-800 transition"
                >
                  {couponLoading ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>

              {/* Thông báo & nút hủy mã đã áp dụng */}
              {coupon && (
                <div className="flex items-center justify-between text-sm mt-3 bg-green-50 p-3 rounded-xl border border-green-200">
                  <span className="text-green-700 font-medium">
                    ✓ Đã áp dụng mã <strong>{coupon.id}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 font-semibold text-xs underline"
                  >
                    Bỏ sử dụng
                  </button>
                </div>
              )}
            </div>

            {/* TỔNG TIỀN */}
            <div className="bg-slate-100 rounded-2xl p-5 mt-6 space-y-3">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{total.toLocaleString("vi-VN")}đ</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>
                    Giảm giá {coupon.type === "percent" ? `(${coupon.value}%)` : ""}
                  </span>
                  <span>-{discount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold">Tổng thanh toán</span>
                <span className="text-2xl font-black text-blue-600">
                  {finalTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* NÚT TẠO ĐƠN */}
            <button
              type="submit"
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