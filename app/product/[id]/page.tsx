
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  game: string;
  rarity: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const snap = await getDoc(doc(db, "products", id));

      if (snap.exists()) {
        setProduct({
          id: snap.id,
          ...(snap.data() as Omit<Product, "id">),
        });
      }
    }

    load();
  }, [params]);

  if (!product) {
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
      >
        <ArrowLeft size={18} />
        Quay lại cửa hàng
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">
            {product.game}
          </span>

          <h1 className="text-4xl font-black mt-4">{product.name}</h1>

          <p className="mt-3 text-slate-500">
            Độ hiếm: <strong>{product.rarity}</strong>
          </p>

          <p className="mt-2 text-slate-500">
            Còn lại: <strong>{product.stock}</strong>
          </p>

          <div className="text-5xl font-black text-blue-600 mt-8">
            {Number(product.price).toLocaleString("vi-VN")}đ
          </div>

          <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold transition">
            Mua ngay
          </button>

          <div className="mt-6 bg-blue-50 rounded-2xl p-5">
            <h3 className="font-bold mb-2">Cam kết DoKhai Game</h3>

            <ul className="space-y-2 text-slate-600">
              <li>✔ Giao dịch nhanh 5–15 phút.</li>
              <li>✔ Hỗ trợ Messenger & Zalo.</li>
              <li>✔ Hoàn tiền nếu không giao được.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}