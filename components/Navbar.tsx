"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  Bell,
  LogOut,
} from "lucide-react";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, login, logout } = useAuth();
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <button className="md:hidden">
            <Menu size={24} />
          </button>

          <Link href="/" className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-400 shadow-lg shadow-blue-300/40">
            <Image
              src="/logo.png"
              alt="DoKhai's Shop"
              fill
              className="object-cover"
            />
          </Link>

          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-slate-900">
              DoKhai's <span className="text-blue-600">Shop</span>
            </h1>

            <p className="text-sm text-slate-500">
              Shop vật phẩm Roblox uy tín
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Tìm sản phẩm, game..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>
        </div>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-6 text-slate-700 font-medium">

          <Link href="/" className="text-blue-600">
            Trang chủ
          </Link>

          <Link href="/product">
            Sản phẩm
          </Link>
<Link href="/wallet">Ví</Link>
          <a href="#">Danh mục</a>

          <a href="#">Nạp tiền</a>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-slate-100 transition">

            <Bell size={22} />

            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              2
            </span>

          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-slate-100 transition"
          >
            <ShoppingCart size={22} />

           <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
  {mounted ? cartCount : 0}
</span>
          </Link>

          {/* Login */}
          {user ? (
  <div className="flex items-center gap-3">

    <div className="hidden md:flex items-center gap-2">

      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={user.photoURL || "/logo.png"}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      <span className="font-semibold text-slate-700 max-w-[120px] truncate">
        {user.displayName}
      </span>

    </div>

    <button
      onClick={logout}
      className="p-2 rounded-full hover:bg-slate-100 transition"
      title="Đăng xuất"
    >
      <LogOut size={22}/>
    </button>

  </div>
) : (
  <button
    onClick={login}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition shadow"
  >
    Đăng nhập
  </button>
)}

        </div>

      </div>
    </header>
  );
}