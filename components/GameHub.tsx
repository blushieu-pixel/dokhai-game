
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const games = [
  {
    title: "Grow a Garden 2",
    image: "/games/grow-a-garden.jpg",
    color: "from-green-500/40 to-emerald-600/30",
    badge: "HOT",
  },
  {
    title: "Steal a Brainrot",
    image: "/games/steal-brainrot.jpg",
    color: "from-orange-500/40 to-pink-500/30",
    badge: "NEW",
  },
];

export default function GameHub() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <div className="mb-8">

        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
          Chọn Game
        </h2>

        <p className="text-slate-500 mt-2">
          Chỉ cần chọn game, chọn vật phẩm và mua trong vài giây.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {games.map((game) => (

          <button
            key={game.title}
            className="group rounded-[32px] overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-left"
          >

            <div className="relative h-64">

              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              <div className={`absolute inset-0 bg-gradient-to-t ${game.color}`}></div>

              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {game.badge}
              </span>

            </div>

            <div className="p-6">

              <h3 className="text-2xl font-black text-slate-900">
                {game.title}
              </h3>

              <p className="text-slate-500 mt-2">
                Seed • Pet • Item • Bundle • Limited
              </p>

              <div className="mt-6 flex items-center text-blue-600 font-bold gap-2">
                Khám phá ngay
                <ArrowRight className="group-hover:translate-x-1 transition"/>
              </div>

            </div>

          </button>

        ))}

      </div>

    </section>
  );
}