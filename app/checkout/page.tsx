"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ShoppingBag, Wallet, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [cart, setCart] = useState<any[]>([]);
  const [robloxName, setRobloxName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    }

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          setBalance(Number(snap.data().wallet ?? snap.data().balance ?? 0));
        }
      }
    });
    return () => unsub();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      return;
    }
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    if (balance < totalAmount) {
      alert("Số dư ví không đủ. Vui lòng nạp thêm tiền!");
      return;
    }

    setLoading(true);

    try {
      const deliveredItems: any[] = [];
      let isAutoDelivered = false;

      // Xử lý kiểm tra bốc acc từ kho
      for (const item of cart) {
        const q = query(
          collection(db, "stock_accounts"),
          where("productId", "==", item.id),
          where("isSold", "==", false),
          limit(item.quantity || 1)
        );

        const stockSnap = await getDocs(q);

        if (stockSnap.size >= (item.quantity || 1)) {
          // Trường hợp 1: Có sẵn acc trong kho -> Bốc acc tự động
          const accountsAssigned: any[] = [];
          for (const accountDoc of stockSnap.docs) {
            const accData = accountDoc.data();
            await updateDoc(doc(db, "stock_accounts", accountDoc.id), {
              isSold: true,
              soldToUserId: user.uid,
              soldAt: serverTimestamp(),
            });

            accountsAssigned.push({
              username: accData.username,
              password: accData.password,
            });
          }

          deliveredItems.push({
            ...item,
            assignedAccounts: accountsAssigned,
          });
          isAutoDelivered = true;
        } else {
          // Trường hợp 2: Kho hết acc -> Chuyển thành đơn hàng thường để Admin giao thủ công
          deliveredItems.push({
            ...item,
            assignedAccounts: [],
          });
        }
      }

      // 1. Trừ tiền ví
      const newBalance = balance - totalAmount;
      await updateDoc(doc(db, "users", user.uid), { wallet: newBalance });

      // 2. Tạo đơn hàng (Trạng thái completed nếu có acc tự động, paid nếu chờ Admin giao)
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customer: {
          robloxName: robloxName || user.displayName || "Khách mua hàng",
        },
        items: deliveredItems,
        total: totalAmount,
        status: isAutoDelivered ? "completed" : "paid",
        createdAt: serverTimestamp(),
      });

      // 3. Xóa giỏ hàng
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));

      // 4. Chuyển sang trang chi tiết đơn hàng
      router.push(`/orders/${orderRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-600" /> Xác Nhận Mua Hàng
        </h1>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-500">Số dư ví hiện tại:</span>
            <span className="text-blue-600">{balance.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-500">Tổng tiền đơn hàng:</span>
            <span className="text-red-600">{totalAmount.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Username Roblox của bạn (Nhập tên nick game để Admin hỗ trợ giao)
          </label>
          <input
            type="text"
            value={robloxName}
            onChange={(e) => setRobloxName(e.target.value)}
            placeholder="Nhập tên Roblox..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 text-base disabled:opacity-60"
        >
          <Wallet className="w-5 h-5" />
          {loading ? "Đang xử lý thanh toán..." : "Thanh Toán Bằng Số Dư Ví"}
        </button>
      </div>
    </main>
  );
}