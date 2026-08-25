"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  Home,
  Gamepad2,
  Wallet,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Sản phẩm", href: "/product", icon: Gamepad2 },
    { name: "Nạp tiền ví", href: "/wallet", icon: Wallet },
    { name: "Giỏ hàng", href: "/cart", icon: ShoppingBag },
    { name: "Tài khoản", href: "/wallet", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="bg-blue-600 text-white font-black px-2.5 py-1 rounded-xl text-base">
            DoKhai
          </span>
          <span className="font-extrabold text-lg text-slate-800">Shop</span>
        </Link>

        {/* Menu cho Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Info & Nút 3 sọc Mobile */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/wallet"
                className="flex items-center gap-1 bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm border border-blue-100"
              >
                <Wallet className="w-3.5 h-3.5" />
                {(userData?.wallet || 0).toLocaleString("vi-VN")}đ
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hidden sm:block"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition"
            >
              Đăng nhập
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu xổ xuống trên Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Icon className="w-5 h-5 text-slate-500" />
                {link.name}
              </Link>
            );
          })}
          {user && (
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </header>
  );
}