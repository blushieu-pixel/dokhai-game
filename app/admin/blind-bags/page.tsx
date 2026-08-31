"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { PackagePlus, Key, Database, CheckCircle2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  game: string;
}

export default function AdminBlindBagsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [accountsText, setAccountsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockCount, setStockCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(list);
      if (list.length > 0) setSelectedProductId(list[0].id);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    async function checkStock() {
      const q = query(
        collection(db, "stock_accounts"),
        where("productId", "==", selectedProductId),
        where("isSold", "==", false)
      );
      const snap = await getDocs(q);
      setStockCount(snap.size);
    }
    checkStock();
  }, [selectedProductId]);

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
      setStockCount((prev) => (prev ?? 0) + addedCount);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm tài khoản vào kho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <PackagePlus className="w-7 h-7 text-blue-600" /> Nạp Kho Acc Túi Mù
        </h1>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Chọn sản phẩm Túi Mù</label>
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

          {stockCount !== null && (
            <p className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> Hiện còn trong kho: {stockCount} acc chưa bán
            </p>
          )}
        </div>

        <form onSubmit={handleAddStock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nhập danh sách Acc (Định dạng: <span className="text-red-600 font-mono">Taikhoan|Matkhau</span>)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">Mỗi tài khoản dán trên 1 dòng riêng biệt.</p>
            <textarea
              rows={8}
              value={accountsText}
              onChange={(e) => setAccountsText(e.target.value)}
              placeholder={`accroblox1|mk123456\naccroblox2|mk654321\naccroblox3|mk888888`}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl transition shadow-md shadow-blue-500/20 active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" /> {loading ? "Đang lưu kho..." : "Lưu vào kho hàng"}
          </button>
        </form>
      </div>
    </div>
  );
}