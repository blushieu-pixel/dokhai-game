"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import useCart from "@/hooks/useCart";
import { ShoppingBag, Wallet, LogOut, Shield } from "lucide-react";

export default function Navbar() {
  const { user, userData, loginWithGoogle, logout } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="font-black text-xl text-slate-900 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2.5 py-1 rounded-xl">DoKhai</span>
          <span>Shop</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <Link href="/product" className="hover:text-blue-600 transition">Sản phẩm</Link>
          <Link href="/wallet" className="hover:text-blue-600 transition flex items-center gap-1">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Ví ({(userData?.wallet || 0).toLocaleString("vi-VN")}đ)</span>
          </Link>
          {userData?.role === "admin" && (
            <Link href="/admin/orders" className="text-red-600 hover:text-red-700 transition flex items-center gap-1 font-bold">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Avatar"} className="w-8 h-8 rounded-full border" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <span className="font-bold text-sm text-slate-800 hidden sm:inline">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}