"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import OrderTimeline from "@/components/OrderTimeline";
interface Order {
  customer: {
    robloxName: string;
    robloxUID: string;
    note?: string;
  };
  total: number;
  status: string;
}

export default function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { id } = await params;
setOrderId(id);
      const snap = await getDoc(doc(db, "orders", id));

      if (snap.exists()) {
        setOrder(snap.data() as Order);
      }

      setLoading(false);
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Đang tải đơn hàng...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Không tìm thấy đơn.
      </main>
    );
  }

  const statusColor =
    order.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : order.status === "paid"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  const statusText =
    order.status === "pending"
      ? "Chờ thanh toán"
      : order.status === "paid"
      ? "Đã thanh toán"
      : "Đã giao";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-black">
          Chi tiết đơn hàng
        </h1>

        <div className="bg-white rounded-3xl shadow p-8 mt-8">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-500">
                Mã đơn
              </p>

             <h2 className="font-black text-xl">
  DKG-{orderId.slice(0, 6).toUpperCase()}
</h2>

            </div>

            <span className={`px-4 py-2 rounded-full font-semibold ${statusColor}`}>
              {statusText}
            </span>
<OrderTimeline status={order.status} />
          </div>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between">

              <span>Username Roblox</span>

              <span className="font-bold">
                {order.customer.robloxName}
              </span>

            </div>

            <div className="flex justify-between">

              <span>UID</span>

              <span className="font-bold">
                {order.customer.robloxUID}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Tổng tiền</span>

              <span className="font-black text-blue-600">
                {order.total.toLocaleString("vi-VN")}đ
              </span>

            </div>

          </div>

          {order.customer.note && (
            <div className="mt-8 bg-slate-100 rounded-2xl p-5">

              <p className="text-sm text-slate-500">
                Ghi chú
              </p>

              <p className="mt-2">
                {order.customer.note}
              </p>

            </div>
          )}

          <Link
            href="/"
            className="block w-full mt-8 text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold"
          >
            Về trang chủ
          </Link>

        </div>

      </div>
    </main>
  );
}