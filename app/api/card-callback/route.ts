export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function handleCallback(data: any) {
  const { status, request_id, amount, value, code } = data;
  const uid = request_id?.split("_")[0];

  if (!uid) return;

  if (Number(status) === 1) {
    const realAmount = Number(amount || value);

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      wallet: increment(realAmount),
    });

    await addDoc(collection(db, "walletTransactions"), {
      uid: uid,
      amount: realAmount,
      type: "deposit",
      description: `Nạp thẻ cào tự động (${code})`,
      status: "completed",
      createdAt: serverTimestamp(),
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await handleCallback(data);
    return NextResponse.json({ status: 200, message: "OK" });
  } catch (err) {
    return NextResponse.json({ message: "Lỗi xử lý callback" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = Object.fromEntries(searchParams.entries());
    await handleCallback(data);
    return NextResponse.json({ status: 200, message: "OK" });
  } catch (err) {
    return NextResponse.json({ message: "Lỗi xử lý callback" }, { status: 500 });
  }
}