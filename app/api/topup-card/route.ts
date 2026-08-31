export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { uid, cardType, declaredAmount, serial, code } = await request.json();

    if (!uid || !cardType || !declaredAmount || !serial || !code) {
      return NextResponse.json({
        status: 400,
        message: "Thiếu thông tin thẻ, vui lòng kiểm tra lại!",
      });
    }

    const partnerId = process.env.GACHTHEFAST_PARTNER_ID || "8832586655";
    const partnerKey = process.env.GACHTHEFAST_PARTNER_KEY || "72f315b7e96ac25badbb55e7b5772fbe";

    const cleanCode = code.toString().trim();
    const cleanSerial = serial.toString().trim();
    const requestId = `${uid.slice(0, 8)}_${Date.now()}`;

    const sign = crypto
      .createHash("md5")
      .update(partnerKey + cleanCode + cleanSerial)
      .digest("hex");

    const res = await fetch("https://gachthefast.com/chargingws/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sign: sign,
        telco: cardType.toString().toUpperCase(),
        code: cleanCode,
        serial: cleanSerial,
        amount: Number(declaredAmount),
        request_id: requestId,
        partner_id: partnerId,
        command: "charging",
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Lỗi kết nối cổng Gachthefast:", error);
    return NextResponse.json({
      status: 500,
      message: "Không thể kết nối tới cổng gạch thẻ!",
    });
  }
}