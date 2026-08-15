import Link from "next/link";
import { Package, ShoppingCart, Wallet, Users } from "lucide-react";

export default function AdminPage() {
  const cards = [
    {
      title: "Quản lý sản phẩm",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "Đơn hàng",
      icon: ShoppingCart,
      href: "#",
      color: "bg-green-500",
    },
    {
      title: "Nạp tiền",
      icon: Wallet,
      href: "#",
      color: "bg-orange-500",
    },
    {
      title: "Khách hàng",
      icon: Users,
      href: "#",
      color: "bg-purple-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900">
            DoKhai Game Admin
          </h1>

          <p className="text-slate-500 mt-2">
            Quản lý shop Roblox của bạn.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white rounded-3xl p-6 shadow hover:shadow-xl transition hover:-translate-y-1"
              >
                <div
                  className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-5 font-bold text-xl">
                  {card.title}
                </h3>

                <p className="text-slate-500 mt-2">
                  Quản lý nhanh.
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}