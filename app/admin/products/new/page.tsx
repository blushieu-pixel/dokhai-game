"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    game: "Grow a Garden 2",
    price: "",
    oldPrice: "",
    stock: "10",
    tag: "HOT",
    image: "/logo.png",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("https://api.imgbb.com/1/upload?key=a16669a4b1c76ea7bbe106eab086ab5d", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.data.url }));
      } else {
        alert("Lỗi tải ảnh lên ImgBB!");
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ tải ảnh!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) return alert("Vui lòng đợi ảnh tải lên hoàn tất!");
    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        name: form.name,
        game: form.game,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice) || Number(form.price),
        stock: Number(form.stock) || 1,
        tag: form.tag,
        image: form.image,
        createdAt: serverTimestamp(),
      });
      alert("Thêm sản phẩm thành công!");
      router.push("/admin/products");
    } catch (err) {
      alert("Lỗi khi thêm sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
        <h1 className="text-xl font-black text-slate-900">Thêm Sản Phẩm Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 block">Hình ảnh sản phẩm</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center flex-shrink-0">
              {imagePreview || form.image !== "/logo.png" ? (
                <Image src={imagePreview || form.image} alt="Preview" fill className="object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>

            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl border border-slate-300 transition flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              {uploadingImage ? "Đang tải ảnh..." : "Chọn ảnh từ thiết bị"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploadingImage} />
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600">Tên vật phẩm / Acc</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ví dụ: Pet Trái Cây Mythic Max Level"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Danh mục Game</label>
            <select
              value={form.game}
              onChange={(e) => setForm({ ...form, game: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Grow a Garden 2">Grow a Garden 2</option>
              <option value="Steal a Brainrot">Steal a Brainrot</option>
              <option value="Blox Fruits">Blox Fruits</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Nhãn (Tag)</label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="HOT, VIP, -30%..."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Giá bán (đ)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Giá gốc (đ)</label>
            <input
              type="number"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Số lượng kho</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? "Đang lưu..." : "Lưu Sản Phẩm"}
        </button>
      </form>
    </div>
  );
}