
"use client";

import Image from "next/image";
import { Menu, Search, ShoppingCart, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <button className="md:hidden">
            <Menu size={24} />
          </button>

          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-400 shadow-lg shadow-blue-300/40">
            <Image
              src="/logo.png"
              alt="DoKhai Game"
              fill
              className="object-cover"
            />
          </div>

          <div className="hidden sm:block">
            <h1 className="font-bold text-xl text-slate-900">
              DoKhai <span className="text-blue-600">Game</span>
            </h1>
            <p className="text-sm text-slate-500">
              Shop vật phẩm Roblox uy tín
            </p>
          </div>
        </div>

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

        <nav className="hidden lg:flex items-center gap-6 text-slate-700 font-medium">
          <a href="#" className="text-blue-600">Trang chủ</a>
          <a href="#">Sản phẩm</a>
          <a href="#">Danh mục</a>
          <a href="#">Nạp tiền</a>
        </nav>

        <div className="flex items-center gap-2">

          <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              2
            </span>
          </button>

          <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              0
            </span>
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition shadow">
            Đăng nhập
          </button>

        </div>

      </div>
    </header>
  );
}