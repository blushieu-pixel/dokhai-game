"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, CreditCard, History } from "lucide-react";

export default function WalletPage() {
  const { userData } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* THẺ TỔNG QUAN SỐ DƯ */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-blue-100 font-medium">
            <Wallet className="w-5 h-5" />
            <span>Ví cá nhân DoKhai</span>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            Thành viên
          </span>
        </div>

        <div className="mb-6">
          <p className="text-blue-100 text-sm font-medium">SỐ DƯ HIỆN TẠI</p>
          <h1 className="text-4xl font-black mt-1">
            {(userData?.wallet || 0).toLocaleString("vi-VN")}đ
          </h1>
        </div>

        {/* NÚT NẠP TIỀN TRỎ ĐÚNG ROUTE /wallet/topup */}
        <Link
          href="/wallet/topup"
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition shadow-md"
        >
          <CreditCard className="w-5 h-5" />
          <span>Nạp tiền</span>
        </Link>
      </div>

      {/* LỊCH SỬ GIAO DỊCH */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-500" />
          <span>Lịch sử giao dịch</span>
        </h2>
        <div className="text-center py-8 text-slate-400 text-sm">
          Chưa có giao dịch nào
        </div>
      </div>
    </div>
  );
}