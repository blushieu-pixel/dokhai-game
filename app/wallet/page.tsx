"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { Wallet as WalletIcon, ShoppingBag, ArrowUpRight } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: any;
  items: any[];
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Đồng bộ số dư ví của tài khoản
      const userUnsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBalance(Number(data.wallet ?? data.balance ?? 0));
        }
      });

      // 2. Truy vấn lịch sử giao dịch mua hàng theo userId
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const ordersUnsub = onSnapshot(q, (snapshot) => {
        const list: Order[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];

        // Sắp xếp đơn mới nhất nằm trên cùng
        list.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setOrders(list);
        setLoading(false);
      });

      return () => {
        userUnsub();
        ordersUnsub();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* SỐ DƯ VÍ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-100 text-sm font-semibold">
                <WalletIcon className="w-4 h-4" /> Ví cá nhân DoKhai
              </div>
              <p className="text-xs font-medium text-blue-200 uppercase tracking-wider pt-2">Số dư hiện tại</p>
              <h2 className="text-4xl font-black">
                {balance.toLocaleString("vi-VN")}đ
              </h2>
            </div>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
              Thành viên
            </span>
          </div>
        </div>

        {/* LỊCH SỬ GIAO DỊCH */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" /> Lịch sử giao dịch mua hàng
          </h3>

          {loading ? (
            <p className="text-center py-8 text-slate-400 font-medium">Đang tải lịch sử...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-slate-400 font-medium">Chưa có giao dịch nào</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Đơn hàng #DKG-{order.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          order.status === "paid" || order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status === "paid"
                          ? "Đã thanh toán"
                          : order.status === "completed"
                          ? "Đã giao hàng"
                          : order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {order.createdAt?.seconds
                        ? new Date(order.createdAt.seconds * 1000).toLocaleString("vi-VN")
                        : "Vừa xong"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-red-600 text-base">
                      -{order.total?.toLocaleString("vi-VN")}đ
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}