export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

const PARTNER_ID = "8832586655";
const PARTNER_KEY = "72f315b7e96ac25badbb55e7b5772fbe";

export async function POST(request: Request) {
  try {
    const { uid, cardType, declaredAmount, serial, code } = await request.json();

    if (!uid || !cardType || !declaredAmount || !serial || !code) {
      return NextResponse.json(
        { error: "Thiếu thông tin thẻ" },
        { status: 400 }
      );
    }

    const requestId = `${uid}_${Date.now()}`;

    const sign = crypto
      .createHash("md5")
      .update(PARTNER_KEY + code + serial)
      .digest("hex");

    const res = await fetch("https://gachthefast.com/chargingws/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sign: sign,
        telco: cardType,
        code: code,
        serial: serial,
        amount: Number(declaredAmount),
        request_id: requestId,
        partner_id: PARTNER_ID,
        command: "charging",
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi gửi thẻ:", error);
    return NextResponse.json(
      { error: "Không thể kết nối tới cổng gạch thẻ" },
      { status: 500 }
    );
  }
}