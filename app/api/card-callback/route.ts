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

// Tắt cache cho route này
export const dynamic = "force-dynamic";

async function handleCallback(req: Request) {
  try {
    const url = new URL(req.url);
    
    // Lấy tham số từ Query String (GET) hoặc Body (POST)
    let status = url.searchParams.get("status");
    let requestId = url.searchParams.get("request_id");
    let amount = url.searchParams.get("value") || url.searchParams.get("amount");

    if (!status || !requestId) {
      try {
        const body = await req.json();
        status = body.status;
        requestId = body.request_id;
        amount = body.value || body.amount;
      } catch (e) {
        // Bỏ qua nếu không có body JSON
      }
    }

    // Gachthefast trả về status = 1 (hoặc "1") là thẻ chuẩn thành công
    if (String(status) === "1" && requestId) {
      // requestId có dạng: UID_TIMESTAMP (Ví dụ: abcxyz12_1700000000)
      const uidPrefix = requestId.split("_")[0];
      const realAmount = Number(amount || 0);

      if (uidPrefix && realAmount > 0) {
        // Tìm user tương ứng trong Firebase
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
          // 1. Cộng tiền vào số dư ví của khách trên Firebase
          const userRef = doc(db, "users", targetUser.id);
          await updateDoc(userRef, {
            wallet: increment(realAmount),
            balance: increment(realAmount),
          });

          // 2. Ghi lịch sử nạp thẻ
          await addDoc(collection(db, "topup_history"), {
            userId: targetUser.id,
            amount: realAmount,
            type: "card",
            status: "success",
            requestId: requestId,
            createdAt: serverTimestamp(),
          });
        }
      }
    }

    return NextResponse.json({ status: "OK", message: "Callback processed" });
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