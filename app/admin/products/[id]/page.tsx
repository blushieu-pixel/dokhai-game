"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      const ref = doc(db, "products", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct({
          id: snap.id,
          ...snap.data(),
        });
      }

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
        >
          <ArrowLeft size={18}/>
          Quay lại
        </Link>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow p-8">

          <div className="relative h-[420px] rounded-3xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div>

            <div className="text-blue-600 font-bold">
              {product.game}
            </div>

            <h1 className="text-4xl font-black mt-2">
              {product.name}
            </h1>

            <p className="mt-4 text-slate-500">
              Danh mục: {product.category}
            </p>

            <p className="text-slate-500">
              Độ hiếm: {product.rarity}
            </p>

            <div className="text-4xl font-black text-blue-600 mt-8">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </div>

            <div className="mt-2 text-slate-500">
              Kho còn: {product.stock}
            </div>

            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition">
              Mua ngay
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}