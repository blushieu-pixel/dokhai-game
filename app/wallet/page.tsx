"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Wallet, ArrowDownRight, ArrowUpRight, CreditCard, History } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "payment";
  description: string;
  createdAt: any;
  status: "completed" | "pending" | "failed";
}

export default function WalletPage() {
  const { user, userData, loading: authLoading, loginWithGoogle } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "walletTransactions"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const list: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(list);
      } catch (error) {
        console.error("Lỗi lấy lịch sử giao dịch:", error);
      } finally {
        setLoadingTx(false);
      }
    }

    fetchTransactions();
  }, [user]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-medium">
        Đang tải thông tin ví...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black">Ví DoKhai</h1>
          <p className="text-slate-500 text-sm">
            Vui lòng đăng nhập để xem số dư tài khoản và quản lý giao dịch nạp tiền.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition"
          >
            Đăng nhập bằng Google
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">

        {/* THẺ SỐ DƯ VÍ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-100 font-medium text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Ví cá nhân DoKhai
              </span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                {userData?.role === "admin" ? "Admin" : "Thành viên"}
              </span>
            </div>

            <div>
              <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
                Số dư hiện tại
              </p>
              <h2 className="text-4xl font-black mt-1">
                {(userData?.wallet || 0).toLocaleString("vi-VN")}đ
              </h2>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/topup"
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3 rounded-2xl text-sm transition flex items-center gap-2 shadow-sm"
              >
                <CreditCard className="w-4 h-4" /> Nạp tiền
              </Link>
            </div>
          </div>
        </div>

        {/* LỊCH SỬ GIAO DỊCH */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" /> Lịch sử giao dịch
            </h3>
          </div>

          {loadingTx ? (
            <p className="text-center text-slate-500 py-6 text-sm">Đang tải lịch sử...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-1">
              <p className="font-medium text-slate-500">Chưa có giao dịch nào</p>
              <p className="text-xs">Các biến động số dư ví sẽ hiển thị tại đây</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === "deposit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {tx.createdAt?.toDate
                          ? tx.createdAt.toDate().toLocaleString("vi-VN")
                          : "Vừa xong"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-black text-sm ${
                        tx.type === "deposit" ? "text-green-600" : "text-slate-900"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}
                      {tx.amount.toLocaleString("vi-VN")}đ
                    </p>
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      {tx.status === "completed" ? "Thành công" : "Chờ xử lý"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}