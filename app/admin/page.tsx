"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface Order {
  id: string;
  customer?: {
    robloxName?: string;
    robloxUID?: string;
  };
  total?: number;
  status?: string;
  createdAt?: any;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Thống kê & đơn hàng gần đây
    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersList: Order[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Order[];

      // Sắp xếp đơn mới nhất lên đầu
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      // Tính tổng doanh thu từ các đơn đã thanh toán hoặc đã giao
      const revenue = ordersList.reduce((sum, order) => {
        if (order.status === "paid" || order.status === "completed") {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);

      setStats((prev) => ({
        ...prev,
        totalRevenue: revenue,
        totalOrders: ordersList.length,
      }));

      // Lấy 5 đơn mới nhất
      setRecentOrders(ordersList.slice(0, 5));
    });

    // 2. Thống kê tổng số sản phẩm
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalProducts: snapshot.size }));
    });

    // 3. Thống kê tổng số thành viên
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalUsers: snapshot.size }));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold">
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* TIÊU ĐỀ & THAO TÁC NHANH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tổng Quan Shop</h1>
          <p className="text-xs text-slate-400">
            Theo dõi doanh thu, đơn hàng và hoạt động của cửa hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </Link>
          <Link
            href="/"
            target="_blank"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition border border-slate-200"
          >
            Xem Shop →
          </Link>
        </div>
      </div>

      {/* 4 THẺ THỐNG KÊ (STATS CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng doanh thu</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">
            {stats.totalRevenue.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Đã ghi nhận thanh toán
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng đơn hàng</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalOrders} đơn</p>
          <Link href="/admin/orders" className="text-[10px] text-blue-600 font-bold hover:underline">
            Quản lý đơn →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng sản phẩm</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalProducts} sp</p>
          <Link href="/admin/products" className="text-[10px] text-purple-600 font-bold hover:underline">
            Xem sản phẩm →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Thành viên</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalUsers} người</p>
          <p className="text-[10px] text-slate-400 font-medium">Tài khoản đã đăng ký</p>
        </div>
      </div>

      {/* DANH SÁCH ĐƠN HÀNG GẦN ĐÂY */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Đơn hàng gần đây</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-center py-6 text-slate-400 text-xs font-medium">
            Chưa có đơn hàng nào
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3 flex items-center justify-between text-sm hover:bg-slate-50 px-2 rounded-xl transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      #DKG-{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "paid"
                        ? "Đã thanh toán"
                        : order.status === "completed"
                        ? "Đã giao"
                        : "Chờ thanh toán"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Khách: {order.customer?.robloxName || "N/A"} (UID: {order.customer?.robloxUID || "N/A"})
                  </p>
                </div>

                <span className="font-black text-blue-600 text-base">
                  {(order.total || 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}