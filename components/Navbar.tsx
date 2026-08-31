"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Wallet, LogOut, User as UserIcon, ShoppingCart, Menu, X, Home, PlusCircle } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userUnsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBalance(Number(data.wallet ?? data.balance ?? 0));
          }
        });
        return () => userUnsub();
      } else {
        setBalance(0);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="bg-blue-600 text-white font-black px-2.5 py-1 rounded-xl text-sm sm:text-base">
              DoKhai
            </div>
            <span className="font-bold text-slate-800 text-base sm:text-lg">Shop</span>
          </Link>

          {/* MENU TRÊN MÁY TÍNH (ẨN TRÊN DI ĐỘNG) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <Link href="/wallet" className="hover:text-blue-600 transition">Nạp tiền ví</Link>
            <Link href="/cart" className="hover:text-blue-600 transition flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" /> Giỏ hàng
            </Link>
          </nav>

          {/* THÔNG TIN VÍ & NÚT MENU MOBILE */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/wallet"
                  className="bg-blue-50 border border-blue-200 text-blue-700 font-black px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <Wallet className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{balance.toLocaleString("vi-VN")}đ</span>
                </Link>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <UserIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="max-w-[80px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex text-slate-400 hover:text-red-600 transition p-1.5 rounded-xl hover:bg-slate-100"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95 whitespace-nowrap"
              >
                Đăng nhập
              </button>
            )}

            {/* NÚT MỞ MENU 3 GẠCH CHO DI ĐỘNG */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* THANH DROPDOWN MENU KHI BẤM TRÊN DI ĐỘNG */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2 shadow-lg">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 text-sm"
            >
              <Home className="w-4 h-4 text-blue-600" /> Trang chủ
            </Link>
            <Link
              href="/wallet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 text-sm"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" /> Nạp tiền ví
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 text-sm"
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Giỏ hàng
            </Link>

            {user && (
              <div className="border-t border-slate-100 pt-2 mt-2 space-y-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-slate-500">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Tài khoản: <span className="text-slate-900">{user.displayName || user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-red-600 hover:bg-red-50 text-sm transition"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* POPUP ĐĂNG NHẬP / ĐĂNG KÝ */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}