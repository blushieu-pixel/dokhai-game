"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import StatusBadge from "@/components/StatusBadge";

interface Order {
  id: string;
  customer: {
    robloxName: string;
    robloxUID: string;
  };
  total: number;
  status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const snap = await getDocs(collection(db, "orders"));

    setOrders(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, "id">),
      }))
    );
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(id: string, status: string) {
    await updateDoc(doc(db, "orders", id), {
      status,
    });

    loadOrders();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-black mb-8">
          Quản lý đơn hàng
        </h1>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4">Username</th>

                <th className="text-left p-4">UID</th>

                <th className="text-left p-4">Tổng</th>

                <th className="text-left p-4">Trạng thái</th>

                <th className="text-left p-4">Cập nhật</th>

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id} className="border-t">

                  <td className="p-4">
                    {order.customer.robloxName}
                  </td>

                  <td className="p-4">
                    {order.customer.robloxUID}
                  </td>

                  <td className="p-4 font-bold text-blue-600">
                    {order.total.toLocaleString("vi-VN")}đ
                  </td>

                  <td className="p-4">
                    <StatusBadge status={order.status}/>
                  </td>

                  <td className="p-4">

                    <select
                      value={order.status}
                      onChange={(e) =>
                        changeStatus(order.id, e.target.value)
                      }
                      className="border rounded-xl px-3 py-2"
                    >
                      <option value="pending">
                        Chờ thanh toán
                      </option>

                      <option value="paid">
                        Đã thanh toán
                      </option>

                      <option value="delivered">
                        Đã giao
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}