import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-3xl shadow p-10 text-center max-w-md">

        <h1 className="text-3xl font-black text-green-600">
          Đặt hàng thành công!
        </h1>

        <p className="mt-4 text-slate-500">
          Đơn của bạn đã được gửi đến DoKhai Game.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Về trang chủ
        </Link>

      </div>
    </main>
  );
}