
"use client";

import {
  Home,
  Gamepad2,
  Wallet,
  ShoppingCart,
  User,
} from "lucide-react";

const items = [
  { icon: Home, label: "Home", active: true },
  { icon: Gamepad2, label: "Game" },
  { icon: Wallet, label: "Nạp" },
  { icon: ShoppingCart, label: "Giỏ" },
  { icon: User, label: "Tài khoản" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">

      <div className="mx-4 mb-4 rounded-3xl bg-white shadow-2xl border border-blue-100">

        <div className="flex justify-around py-3">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`p-2 rounded-xl ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-slate-500"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`text-xs ${
                    item.active
                      ? "text-blue-600 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

        </div>

      </div>

    </nav>
  );
}