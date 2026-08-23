import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-50 via-sky-100 to-white p-8 md:p-12 shadow-xl">

        {/* Hiệu ứng nền */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-sky-200/40 rounded-full blur-3xl"></div>

        <div className="relative grid md:grid-cols-2 gap-10 items-center">

          {/* Bên trái */}
          <div>

            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-blue-600 font-semibold">
              ⭐ Shop Roblox uy tín
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mt-6 leading-tight">
              DoKhai's
              <span className="text-blue-600"> Shop</span>
            </h1>

            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Chuyên Grow a Garden 2 và Steal a Brainrot.
              Mua vật phẩm nhanh chóng, giao hàng uy tín và hỗ trợ 24/7.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-bold transition shadow-lg hover:scale-105">
                Mua ngay
              </button>

              <button className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-7 py-4 rounded-2xl font-bold transition">
                Xem sản phẩm
              </button>

            </div>

          </div>

          {/* Bên phải */}
          <div className="relative h-[320px] md:h-[460px] flex items-center justify-center">

            <div className="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full ring-4 ring-blue-400 overflow-hidden shadow-2xl bg-white">
              <Image
                src="/logo.png"
                alt="DoKhai Game"
                fill
                className="object-cover"
              />
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}