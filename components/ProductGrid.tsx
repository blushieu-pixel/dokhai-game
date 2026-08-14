
"use client";

import { useState } from "react";
import Image from "next/image";
import { Flame, Star } from "lucide-react";
import { products } from "@/lib/products";

export default function ProductGrid() {
  const [filter, setFilter] = useState("all");

  const filteredProducts = products.filter((item) => {
    if (filter === "all") return true;
    if (filter === "garden") return item.game === "Grow a Garden 2";
    if (filter === "brainrot") return item.game === "Steal a Brainrot";
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

        <div>

          <h2 className="text-4xl font-black text-slate-900">
            Sản phẩm nổi bật
          </h2>

          <p className="text-slate-500 mt-2">
            Chọn nhanh vật phẩm được mua nhiều nhất.
          </p>

        </div>

        {/* Bộ lọc */}
        <div className="flex gap-2 flex-wrap">

          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Tất cả
          </button>

          <button
            onClick={() => setFilter("garden")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === "garden"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Grow a Garden
          </button>

          <button
            onClick={() => setFilter("brainrot")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === "brainrot"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Brainrot
          </button>

        </div>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {filteredProducts.map((item) => (

          <div
            key={item.id}
            className="group bg-white rounded-[28px] overflow-hidden shadow hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >

            <div className="relative h-52">

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {item.tag}
              </span>

            </div>

            <div className="p-5">

              <div className="text-sm text-blue-600 font-semibold">
                {item.game}
              </div>

              <h3 className="font-black text-xl mt-2">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 mt-3">

                <Flame size={16} className="text-orange-500"/>

                <span className="text-sm text-slate-500">
                  Bán chạy
                </span>

              </div>

              <div className="flex justify-between items-center mt-5">

                <div>
                  <div className="text-3xl font-black text-blue-600">
                    {item.price.toLocaleString("vi-VN")}đ
                  </div>

                  <div className="text-sm text-slate-400 line-through">
                    {item.oldPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <Star className="text-yellow-500 fill-yellow-400"/>

              </div>

              <a
  href="/product"
  className="block w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition text-center"
>
  Mua ngay
</a>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}