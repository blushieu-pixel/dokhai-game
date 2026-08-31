"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function TopupPage() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [method, setMethod] = useState<"card" | "qr">("card");
  const [loadingUser, setLoadingUser] = useState(true);

  // State nạp thẻ cào
  const [cardType, setCardType] = useState("VIETTEL");
  const [declaredAmount, setDeclaredAmount] = useState(50000);
  const [serial, setSerial] = useState("");
  const [code, setCode] = useState("");
  const [loadingCard, setLoadingCard] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State sao chép
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Lắng nghe đăng nhập & số dư ví từ Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userUnsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBalance(Number(data.wallet ?? data.balance ?? 0));
          }
        });
        setLoadingUser(false);
        return () => userUnsub();
      } else {
        setBalance(0);
        setLoadingUser(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLoginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Lỗi đăng nhập Google:", err);
      alert("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  async function handleCardSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để nạp thẻ.");
      return;
    }

    setLoadingCard(true);
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
      setLoadingCard(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">
        Đang tải thông tin nạp tiền...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center max-w-md w-full space-y-4">
          <Smartphone className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-2xl font-black">Nạp tiền DoKhai Wallet</h1>
          <p className="text-slate-500 text-sm">Vui lòng đăng nhập để thực hiện nạp tiền.</p>
          <button
            onClick={handleLoginGoogle}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition shadow-md shadow-blue-500/20"
          >
            Đăng nhập bằng Google
          </button>
        </div>
      </main>
    );
  }

  const transferMemo = `NAP ${user.uid.slice(0, 6).toUpperCase()}`;
  const accountNumber = "199918092007";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-center text-slate-900">Nạp tiền DoKhai Wallet</h1>

        {/* SỐ DƯ VÍ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-blue-200 font-semibold flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Số dư hiện tại
            </span>
            <h3 className="text-3xl font-black">{balance.toLocaleString("vi-VN")}đ</h3>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            {user.displayName || user.email?.split("@")[0] || "Thành viên"}
          </span>
        </div>

        {/* CHUYỂN TAB THẺ CÀO / VIETQR */}
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

        {/* TAB 1: THẺ CÀO TỰ ĐỘNG */}
        {method === "card" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
              <CreditCard className="w-5 h-5 text-blue-600" /> Nạp Thẻ Cào Điện Thoại & Game
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Loại Thẻ</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {["VIETTEL", "VINAPHONE", "MOBIFONE", "GARENA", "ZING"].map((type) => (
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
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mã Thẻ (Mã cào)</label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã thẻ sau lớp tráng bạc"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingCard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition disabled:opacity-60 mt-2"
              >
                {loadingCard ? "Đang gửi thẻ lên cổng gạch..." : "Nạp Thẻ Ngay"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CHUYỂN KHOẢN QR */}
        {method === "qr" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 text-slate-900">
              Quét Mã VietQR Ngân Hàng MB Bank
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block">
              <img
                src={`https://img.vietqr.io/image/MB-199918092007-compact2.png?accountName=DO%20DINH%20KHAI&addInfo=${encodeURIComponent(
                  transferMemo
                )}`}
                alt="VietQR DoKhai"
                className="w-64 h-64 object-contain mx-auto rounded-xl shadow-sm"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ngân hàng:</span>
                <strong className="text-slate-900 text-sm">MB Bank</strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <strong className="text-slate-900 text-sm">DO DINH KHAI</strong>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block">Số tài khoản:</span>
                  <strong className="text-blue-600 font-mono text-sm">{accountNumber}</strong>
                </div>
                <button
                  onClick={() => handleCopy(accountNumber, "stk")}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                >
                  {copiedText === "stk" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === "stk" ? "Đã chép" : "Sao chép"}
                </button>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block">Nội dung chuyển khoản:</span>
                  <strong className="text-red-600 font-mono text-sm">{transferMemo}</strong>
                </div>
                <button
                  onClick={() => handleCopy(transferMemo, "memo")}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                >
                  {copiedText === "memo" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === "memo" ? "Đã chép" : "Sao chép"}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-blue-900 text-xs text-left">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>Hệ thống tự động cộng tiền vào ví ngay khi nhận được chuyển khoản đúng nội dung.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}