"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, QrCode, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

export default function TopupPage() {
  const { user, userData, loginWithGoogle } = useAuth();
  const [method, setMethod] = useState<"card" | "qr">("card");

  // State nạp thẻ cào
  const [cardType, setCardType] = useState("VIETTEL");
  const [declaredAmount, setDeclaredAmount] = useState(50000);
  const [serial, setSerial] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleCardSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để nạp thẻ.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/topup-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          cardType,
          declaredAmount,
          serial: serial.trim(),
          code: code.trim(),
        }),
      });

      const result = await res.json();

      if (result.status === 99) {
        setMessage({
          type: "success",
          text: "Gửi thẻ thành công! Hệ thống đang xử lý, tiền sẽ tự động cộng vào ví sau vài giây.",
        });
        setSerial("");
        setCode("");
      } else {
        setMessage({
          type: "error",
          text: result.message || "Mã thẻ hoặc seri không chính xác!",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Không thể kết nối đến cổng nạp thẻ. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center max-w-md w-full space-y-4">
          <Smartphone className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-2xl font-black">Nạp tiền DoKhai Wallet</h1>
          <p className="text-slate-500 text-sm">Vui lòng đăng nhập để thực hiện nạp tiền.</p>
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
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-center text-slate-900">Nạp tiền DoKhai Wallet</h1>

        {/* NÚT CHUYỂN TAB ĐỔI THẺ / VIETQR */}
        <div className="grid grid-cols-2 gap-3 bg-slate-200 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              method === "card" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Thẻ Cào Tự Động
          </button>
          <button
            type="button"
            onClick={() => setMethod("qr")}
            className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              method === "qr" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
            }`}
          >
            <QrCode className="w-4 h-4" /> Chuyển Khoản QR
          </button>
        </div>

        {/* TAB 1: NẠP THẺ CÀO TỰ ĐỘNG */}
        {method === "card" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
              <CreditCard className="w-5 h-5 text-blue-600" /> Nạp Thẻ Cào Điện Thoại
            </h2>

            {message && (
              <div
                className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Nhà Mạng</label>
                <div className="grid grid-cols-3 gap-3">
                  {["VIETTEL", "VINAPHONE", "MOBIFONE"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCardType(type)}
                      className={`py-3 rounded-xl font-bold text-xs border transition ${
                        cardType === type
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mệnh Giá Thẻ</label>
                <select
                  value={declaredAmount}
                  onChange={(e) => setDeclaredAmount(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-white font-semibold text-slate-800"
                >
                  <option value={10000}>10.000đ</option>
                  <option value={20000}>20.000đ</option>
                  <option value={50000}>50.000đ</option>
                  <option value={100000}>100.000đ</option>
                  <option value={200000}>200.000đ</option>
                  <option value={500000}>500.000đ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mã Số Seri</label>
                <input
                  required
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="Nhập dãy số Seri"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mã Thẻ (Mã cào)</label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã thẻ sau lớp tráng bạc"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition disabled:opacity-60 mt-2"
              >
                {loading ? "Đang gửi thẻ lên cổng gạch..." : "Nạp Thẻ Ngay"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CHUYỂN KHOAN QR */}
        {method === "qr" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-4">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 text-slate-900">
              Quét Mã VietQR Ngân Hàng
            </h2>
            <div className="bg-slate-100 p-4 rounded-2xl inline-block">
              <img
  src={`https://img.vietqr.io/image/MB-199918092007-compact2.png?accountName=DO%20DINH%20KHAI&addInfo=NAP%20${user.uid.slice(0, 6)}`}
  alt="VietQR DoKhai"
  className="w-64 h-64 object-contain mx-auto rounded-xl"
/>
            </div>
            <p className="text-sm text-slate-600">
              Nội dung chuyển khoản: <strong className="text-blue-600">NAP {user.uid.slice(0, 6)}</strong>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}