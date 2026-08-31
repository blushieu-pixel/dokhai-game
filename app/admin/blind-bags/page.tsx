"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  PackagePlus,
  Key,
  Database,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  game: string;
}

interface StockAccount {
  id: string;
  productId: string;
  username: string;
  password: string;
  isSold: boolean;
  createdAt: any;
  soldToUserId?: string;
}

export default function AdminBlindBagsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [accountsText, setAccountsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockList, setStockList] = useState<StockAccount[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // 1. Tải danh sách sản phẩm
  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(list);
      if (list.length > 0) setSelectedProductId(list[0].id);
    }
    loadProducts();
  }, []);

  // 2. Lắng nghe danh sách Acc theo thời gian thực (Real-time Firestore)
  useEffect(() => {
    if (!selectedProductId) return;

    const q = query(
      collection(db, "stock_accounts"),
      where("productId", "==", selectedProductId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: StockAccount[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as StockAccount[];

      // Sắp xếp: Acc mới nạp lên đầu
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setStockList(list);
    });

    return () => unsubscribe();
  }, [selectedProductId]);

  // 3. Xử lý thêm danh sách Acc vào kho
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !accountsText.trim()) {
      alert("Vui lòng chọn sản phẩm và nhập danh sách tài khoản!");
      return;
    }

    setLoading(true);
    const lines = accountsText.trim().split("\n");
    let addedCount = 0;

    try {
      for (const line of lines) {
        const parts = line.split("|");
        if (parts.length >= 2) {
          const username = parts[0].trim();
          const password = parts[1].trim();

          if (username && password) {
            await addDoc(collection(db, "stock_accounts"), {
              productId: selectedProductId,
              username,
              password,
              isSold: false,
              createdAt: serverTimestamp(),
            });
            addedCount++;
          }
        }
      }

      alert(`Đã thêm thành công ${addedCount} tài khoản vào kho!`);
      setAccountsText("");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm tài khoản vào kho.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Xóa tài khoản khỏi kho
  const handleDeleteAccount = async (accId: string, username: string) => {
    if (confirm(`Bạn có chắc muốn xóa tài khoản "${username}" khỏi kho?`)) {
      try {
        await deleteDoc(doc(db, "stock_accounts", accId));
      } catch (err) {
        alert("Không thể xóa tài khoản này!");
      }
    }
  };

  // Ẩn/Hiện mật khẩu
  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const availableCount = stockList.filter((a) => !a.isSold).length;
  const soldCount = stockList.filter((a) => a.isSold).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PackagePlus className="w-7 h-7 text-blue-600" /> Quản Lý & Nạp Kho Acc Túi Mù
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Thêm tài khoản mới và xem danh sách chi tiết kho hàng thời gian thực
          </p>
        </div>
      </div>

      {/* KHỐI 1: FORM NẠP ACC MỚI */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Chọn sản phẩm Túi Mù
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.game}] {p.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAddStock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nhập danh sách Acc (Cú pháp: <span className="text-red-600 font-mono">Taikhoan|Matkhau</span>)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">Mỗi tài khoản dán trên 1 dòng riêng biệt.</p>
            <textarea
              rows={5}
              value={accountsText}
              onChange={(e) => setAccountsText(e.target.value)}
              placeholder={`accroblox1|mk123456\naccroblox2|mk654321\naccroblox3|mk888888`}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl transition shadow-md shadow-blue-500/20 active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Key className="w-4 h-4" /> {loading ? "Đang lưu kho..." : "Lưu vào kho hàng"}
          </button>
        </form>
      </div>

      {/* KHỐI 2: BẢNG DANH SÁCH ACC TRONG KHO (F5 KHÔNG MẤT) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> Danh Sách Acc Trong Kho
            </h3>
            <p className="text-xs text-slate-400">
              Dữ liệu lưu trữ cố định trên cơ sở dữ liệu Firebase
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Còn kho: {availableCount}
            </span>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Đã bán: {soldCount}
            </span>
          </div>
        </div>

        {stockList.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium">
            Chưa có tài khoản nào được nạp cho sản phẩm này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold bg-slate-50">
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Tài Khoản</th>
                  <th className="py-3 px-4">Mật Khẩu</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockList.map((acc, index) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {acc.username}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800">
                          {showPasswords[acc.id] ? acc.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => togglePassword(acc.id)}
                          className="text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPasswords[acc.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {acc.isSold ? (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-2.5 py-1 rounded-md">
                          Đã bán
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 border border-green-100 text-[11px] font-bold px-2.5 py-1 rounded-md">
                          Chưa bán (Sẵn sàng)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteAccount(acc.id, acc.username)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Xóa khỏi kho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}