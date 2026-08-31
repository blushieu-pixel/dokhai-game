"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Sparkles, Copy, Check, Key, ShieldCheck, ShoppingBag } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      const docSnap = await getDoc(doc(db, "orders", id as string));
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Đang nhận Acc Túi Mù...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Không tìm thấy đơn hàng!</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* BANNER THÀNH CÔNG */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl text-center space-y-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-black">Mở Túi Mù Thành Công!</h1>
          <p className="text-xs text-blue-100">Dưới đây là thông tin tài khoản Roblox của bạn</p>
        </div>

        {/* THÔNG TIN TÀI KHOẢN ĐÃ MUA */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b pb-3">
            <Key className="w-5 h-5 text-blue-600" /> Tài Khoản Roblox Đã Nhận
          </h2>

          <div className="space-y-4">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {item.name}
                </span>

                {item.assignedAccounts?.map((acc: any, accIdx: number) => (
                  <div key={accIdx} className="space-y-3 pt-2">
                    {/* TÊN TÀI KHOẢN */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">TÀI KHOẢN</span>
                        <strong className="text-slate-900 font-mono text-sm">{acc.username}</strong>
                      </div>
                      <button
                        onClick={() => handleCopy(acc.username, `user_${idx}_${accIdx}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        {copiedKey === `user_${idx}_${accIdx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === `user_${idx}_${accIdx}` ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>

                    {/* MẬT KHẨU */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">MẬT KHẨU</span>
                        <strong className="text-red-600 font-mono text-sm">{acc.password}</strong>
                      </div>
                      <button
                        onClick={() => handleCopy(acc.password, `pass_${idx}_${accIdx}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        {copiedKey === `pass_${idx}_${accIdx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === `pass_${idx}_${accIdx}` ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-blue-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>Khuyên dùng: Đăng nhập vào Roblox và đổi ngay mật khẩu để bảo mật tài khoản cá nhân.</p>
          </div>
        </div>
      </div>
    </main>
  );
}