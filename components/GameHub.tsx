"use client";

import { useState } from "react";
import { Sparkles, Gamepad2, Flame, Layers } from "lucide-react";

export default function GameHub() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả vật phẩm", count: "120+", icon: Layers, color: "from-blue-500 to-indigo-600" },
    { id: "garden", name: "Grow a Garden 2", count: "45", icon: Sparkles, color: "from-emerald-500 to-teal-600" },
    { id: "brainrot", name: "Steal a Brainrot", count: "38", icon: Flame, color: "from-rose-500 to-orange-600" },
    { id: "bloxfruits", name: "Acc Blox Fruits", count: "25", icon: Gamepad2, color: "from-purple-500 to-violet-600" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-blue-600" />
            Danh Mục Game
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Chọn game bạn muốn tìm vật phẩm hoặc tài khoản
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border ${
                isActive
                  ? "border-blue-500 bg-white shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {cat.count} item
                </span>
              </div>
              <h3 className="font-extrabold text-slate-800 mt-3 text-sm md:text-base">
                {cat.name}
              </h3>
            </button>
          );
        })}
      </div>
    </section>
  );
}