"use client";

import Image from "next/image";
import { PAYMENT } from "@/config/payment";
import useCart from "@/hooks/useCart";

export default function PaymentPage() {
  const { total } = useCart();

  const qrUrl =
    `https://img.vietqr.io/image/${PAYMENT.bankCode}-${PAYMENT.accountNumber}-compact2.png?amount=${total}&addInfo=DOKHAI`;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-10">

        <div className="bg-white rounded-3xl shadow p-8 text-center">

          <h1 className="text-3xl font-black">
            Thanh toán VietQR
          </h1>

          <p className="text-slate-500 mt-3">
            Quét mã để chuyển khoản.
          </p>

          <div className="relative w-72 h-72 mx-auto mt-8">
            <Image
              src={qrUrl}
              alt="QR"
              fill
              unoptimized
            />
          </div>

          <div className="mt-8 space-y-2 text-left bg-slate-100 rounded-2xl p-5">

            <div className="flex justify-between">
              <span>Ngân hàng</span>
              <span className="font-bold">{PAYMENT.bankCode}</span>
            </div>

            <div className="flex justify-between">
              <span>Số tài khoản</span>
              <span className="font-bold">{PAYMENT.accountNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>Chủ TK</span>
              <span className="font-bold">{PAYMENT.accountName}</span>
            </div>

            <div className="flex justify-between text-blue-600">
              <span>Số tiền</span>
              <span className="font-black">
                {total.toLocaleString("vi-VN")}đ
              </span>
            </div>

          </div>

          <button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold">
            Tôi đã chuyển khoản
          </button>

        </div>

      </div>
    </main>
  );
}