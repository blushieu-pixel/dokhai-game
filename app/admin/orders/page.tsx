"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { PackageCheck, CheckCircle, ShoppingBag } from "lucide-react";

interface OrderItem {
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  quantity?: number;
  image?: string;
  game?: string;
}

interface Order {
  id: string;
  userId: string;
  customer: {
    robloxName: string;
    robloxUID: string;
    note?: string;
  };
  total: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list: Order[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Order[];

      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái đơn!");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <PackageCheck className="w-7 h-7 text-blue-600" /> Quản Lý Đơn Hàng (Admin)
        </h1>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200">
          Tổng số: {orders.length} đơn
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border text-slate-400 font-medium">
          Chưa có đơn hàng nào được tạo.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">
                      Mã đơn: DKG-{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "paid"
                        ? "Đã thanh toán (Cần giao hàng)"
                        : order.status === "completed"
                        ? "Đã giao hàng"
                        : "Chờ thanh toán"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ngày tạo:{" "}
                    {order.createdAt?.seconds
                      ? new Date(order.createdAt.seconds * 1000).toLocaleString("vi-VN")
                      : "Vừa xong"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Tổng tiền</p>
                  <p className="text-lg font-black text-blue-600">
                    {order.total?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>

              {/* VẬT PHẨM CẦN GIAO */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-blue-600" /> Vật phẩm đã mua ({order.items?.length || 0})
                </span>
                <div className="divide-y divide-blue-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 text-sm">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name || item.title || "Sp"}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                            />
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{item.name || item.title || "Vật phẩm Roblox"}</p>
                            {item.game && <span className="text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200 font-semibold">{item.game}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-800">x{item.quantity || 1}</span>
                          <p className="text-xs text-slate-500">{(item.price || 0).toLocaleString("vi-VN")}đ</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-1">Không tìm thấy danh sách sản phẩm chi tiết.</p>
                  )}
                </div>
              </div>

              {/* THÔNG TIN KHÁCH HÀNG ROBLOX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Username Roblox</span>
                  <strong className="text-slate-800 text-base">{order.customer?.robloxName || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Roblox UID</span>
                  <strong className="text-blue-600 text-base">{order.customer?.robloxUID || "N/A"}</strong>
                </div>
                {order.customer?.note && (
                  <div className="md:col-span-2 border-t pt-2 border-slate-200">
                    <span className="text-slate-400 text-xs block">Ghi chú từ khách:</span>
                    <p className="text-slate-700 font-medium">{order.customer.note}</p>
                  </div>
                )}
              </div>

              {/* NÚT CẬP NHẬT GIAO HÀNG */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Xem chi tiết đơn →
                </Link>

                <div className="flex items-center gap-2">
                  {order.status !== "completed" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "completed")}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Đã giao hàng thành công
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}