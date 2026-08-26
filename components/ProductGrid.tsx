"use client";

import Image from "next/image";
import { ShoppingBag, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

// Dữ liệu mẫu sản phẩm chất lượng cao
const products = [
  {
    id: "1",
    name: "Pet Trái Cây Mythic Max Level - Grow a Garden 2",
    game: "Grow a Garden 2",
    price: 45000,
    oldPrice: 65000,
    image: "/logo.png",
    stock: 15,
    tag: "HOT",
    sold: 142,
  },
  {
    id: "2",
    name: "Aura Brainrot Siêu Siêu Rẻ - Steal a Brainrot",
    game: "Steal a Brainrot",
    price: 30000,
    oldPrice: 50000,
    image: "/logo.png",
    stock: 8,
    tag: "-40%",
    sold: 89,
  },
  {
    id: "3",
    name: "Gói Hạt Giống Thần Thoại + 10M Coins",
    game: "Grow a Garden 2",
    price: 20000,
    oldPrice: 30000,
    image: "/logo.png",
    stock: 22,
    tag: "BEST SELLER",
    sold: 310,
  },
  {
    id: "4",
    name: "Acc Blox Fruits Meow / Race V4 Max Level",
    game: "Blox Fruits",
    price: 150000,
    oldPrice: 200000,
    image: "/logo.png",
    stock: 3,
    tag: "VIP",
    sold: 45,
  },
];

export default function ProductGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
            Vật Phẩm Nổi Bật
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Giao dịch tự động 100% – Nhận hàng ngay sau 3 giây
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((item) => {
          const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);

          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Hình ảnh sản phẩm */}
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Badge góc trên */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md">
                    -{discount}%
                  </span>
                  {item.tag && (
                    <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 font-extrabold text-[9px] px-2 py-0.5 rounded-lg">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Còn {item.stock}
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.game}
                  </span>
                  <h3 className="font-bold text-slate-800 text-xs md:text-sm mt-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </div>

                {/* Giá tiền */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base md:text-lg font-black text-rose-600">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-xs text-slate-400 line-through font-medium">
                      {item.oldPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {/* Nút Mua hàng */}
                  <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" /> Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}