
"use client";

import Image from "next/image";
import { ShieldCheck, Clock3, Users, Star } from "lucide-react";

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      <section className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-white rounded-[32px] shadow-lg p-5">

            <div className="relative h-96 rounded-2xl overflow-hidden">

              <Image
                src="/games/grow-a-garden.jpg"
                alt="Dragon Seed"
                fill
                className="object-cover"
              />

            </div>

          </div>

          <div>

            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              HOT
            </span>

            <h1 className="text-5xl font-black mt-4 text-slate-900">
              Dragon Seed
            </h1>

            <p className="text-slate-500 mt-2">
              Grow a Garden 2
            </p>

            <div className="mt-6">

              <div className="text-5xl font-black text-blue-600">
                79.000đ
              </div>

              <div className="line-through text-slate-400 text-xl">
                120.000đ
              </div>

            </div>

            <div className="bg-white rounded-3xl shadow p-5 mt-8">

              <h3 className="font-bold text-lg mb-4">
                Thông tin nhanh
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">

                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-green-500"/>
                  Còn hàng: 15
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="text-blue-500"/>
                  1–5 phút
                </div>

                <div className="flex items-center gap-2">
                  <Users className="text-purple-500"/>
                  Đã bán 327
                </div>

                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-400"/>
                  4.9/5
                </div>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <div>

                <label className="font-semibold block mb-2">
                  Username Roblox
                </label>

                <input
                  placeholder="Nhập username..."
                  className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-blue-400 outline-none"
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Số lượng
                </label>

                <select className="w-full p-4 rounded-2xl border">

                  <option>1</option>
                  <option>2</option>
                  <option>3</option>

                </select>

              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold transition shadow-lg">
                Thanh toán ngay
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}