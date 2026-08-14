
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const products = [
  {
    name: "Dragon Seed",
    game: "Grow a Garden 2",
    image: "/games/grow-a-garden.jpg",
    oldPrice: "120K",
    newPrice: "79K",
    badge: "-34%",
  },
  {
    name: "OP Brain Jar",
    game: "Steal a Brainrot",
    image: "/games/steal-brainrot.jpg",
    oldPrice: "90K",
    newPrice: "55K",
    badge: "-39%",
  },
];

export default function FlashSale() {
  const [time, setTime] = useState(10800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 10800));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[32px] p-6 text-white shadow-xl">

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

          <div>

            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-2">
              🔥 Flash Sale
            </h2>

            <p className="mt-2 text-blue-100">
              Giá sốc trong thời gian giới hạn
            </p>

          </div>

          <div className="bg-white text-slate-900 rounded-2xl px-5 py-3 shadow-lg">

            <div className="text-xs text-slate-500">
              Kết thúc sau
            </div>

            <div className="text-3xl font-black">
              {h}:{m}:{s}
            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {products.map((item) => (

            <div
              key={item.name}
              className="bg-white rounded-3xl overflow-hidden shadow-lg text-slate-900 hover:scale-[1.02] transition"
            >

              <div className="relative h-52">

                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  {item.badge}
                </span>

              </div>

              <div className="p-5">

                <div className="text-sm text-slate-500">
                  {item.game}
                </div>

                <h3 className="text-2xl font-black mt-1">
                  {item.name}
                </h3>

                <div className="flex items-center gap-3 mt-4">

                  <span className="text-3xl font-black text-blue-600">
                    {item.newPrice}
                  </span>

                  <span className="line-through text-slate-400">
                    {item.oldPrice}
                  </span>

                </div>

                <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition">
                  Mua ngay
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}