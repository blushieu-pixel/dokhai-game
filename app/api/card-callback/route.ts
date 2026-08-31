import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const dynamic = "force-dynamic";

async function handleCallback(req: Request) {
  try {
    const url = new URL(req.url);

    // Lấy dữ liệu từ Query String (GET) hoặc Body (POST)
    let status = url.searchParams.get("status");
    let requestId = url.searchParams.get("request_id");

    // ƯU TIÊN LẤY SỐ TIỀN THỰC NHẬN SAU CHIẾT KHẤU (receive_amount hoặc amount)
    let receiveAmount =
      url.searchParams.get("receive_amount") ||
      url.searchParams.get("amount") ||
      url.searchParams.get("value");

    if (!status || !requestId) {
      try {
        const body = await req.json();
        status = body.status;
        requestId = body.request_id;
        receiveAmount = body.receive_amount || body.amount || body.value;
      } catch (e) {
        // Bỏ qua nếu không có body JSON
      }
    }

    // Gachthefast trả về status = 1 (Thẻ đúng) hoặc status = 2 (Thẻ sai mệnh giá nhưng vẫn xử lý trừ phạt)
    const statusNum = String(status);
    if ((statusNum === "1" || statusNum === "2") && requestId) {
      const uidPrefix = requestId.split("_")[0];
      const realAmountToCredit = Number(receiveAmount || 0);

      if (uidPrefix && realAmountToCredit > 0) {
        // Tìm tài khoản khách hàng tương ứng trong Firebase
        const usersSnap = await getDocs(collection(db, "users"));
        let targetUser: any = null;

        usersSnap.forEach((uDoc) => {
          const uData = uDoc.data();
          const fullUid = (uData.uid || uDoc.id).toString();
          if (fullUid.startsWith(uidPrefix)) {
            targetUser = { id: uDoc.id, ...uData };
          }
        });

        if (targetUser) {
          // 1. Chỉ cộng ĐÚNG SỐ TIỀN THỰC NHẬN (Đã trừ chiết khấu) vào ví khách
          const userRef = doc(db, "users", targetUser.id);
          await updateDoc(userRef, {
            wallet: increment(realAmountToCredit),
            balance: increment(realAmountToCredit),
          });

          // 2. Lưu lịch sử nạp thẻ
          await addDoc(collection(db, "topup_history"), {
            userId: targetUser.id,
            amount: realAmountToCredit,
            type: "card",
            status: "success",
            requestId: requestId,
            createdAt: serverTimestamp(),
          });
        }
      }
    }

    return NextResponse.json({ status: "OK", message: "Callback processed successfully" });
  } catch (error: any) {
    console.error("Lỗi Callback Gachthefast:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleCallback(req);
}

export async function POST(req: Request) {
  return handleCallback(req);
}