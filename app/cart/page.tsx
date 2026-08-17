"use client";

import Image from "next/image";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    total,
    increase,
    decrease,
    removeItem,
  } = useCart();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
        >
          <ArrowLeft size={18}/>
          Tiếp tục mua sắm
        </Link>

        <h1 className="text-4xl font-black mb-8">
          Giỏ hàng
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            Giỏ hàng đang trống.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 shadow flex gap-4"
                >

                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">

                    <div className="text-blue-600 text-sm font-semibold">
                      {item.game}
                    </div>

                    <h3 className="font-black text-xl mt-1">
                      {item.name}
                    </h3>

                    <div className="text-blue-600 font-bold mt-2">
                      {item.price.toLocaleString("vi-VN")}đ
                    </div>

                    <div className="flex items-center gap-3 mt-4">

                      <button
                        onClick={() => decrease(item.id)}
                        className="w-9 h-9 rounded-full bg-slate-100"
                      >
                        <Minus size={18} className="mx-auto"/>
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(item.id)}
                        className="w-9 h-9 rounded-full bg-slate-100"
                      >
                        <Plus size={18} className="mx-auto"/>
                      </button>

                    </div>

                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2/>
                  </button>

                </div>

              ))}

            </div>

            <div className="bg-white rounded-3xl p-6 shadow h-fit">

              <h2 className="text-2xl font-black">
                Tổng đơn
              </h2>

              <div className="mt-6 flex justify-between">
                <span>Tạm tính</span>

                <span className="font-bold">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold">
                Thanh toán
              </button>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}