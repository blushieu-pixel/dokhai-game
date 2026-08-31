"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Wallet, LogOut, User as UserIcon, ShoppingCart } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-black px-3 py-1 rounded-xl text-base">
              DoKhai
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">Shop</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-bold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <Link href="/wallet" className="hover:text-blue-600 transition">Nạp tiền ví</Link>
            <Link href="/cart" className="hover:text-blue-600 transition flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" /> Giỏ hàng
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/wallet"
                  className="bg-blue-50 border border-blue-200 text-blue-700 font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5 text-blue-600" />
                  {balance.toLocaleString("vi-VN")}đ
                </Link>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 transition p-1.5 rounded-xl hover:bg-slate-100"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95"
              >
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        </div>
      </header>

      {/* POPUP ĐĂNG NHẬP / ĐĂNG KÝ */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}