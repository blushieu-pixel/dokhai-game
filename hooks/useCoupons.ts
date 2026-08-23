"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Coupon {
  id: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
}

export async function getCoupon(code: string): Promise<Coupon | null> {
  const couponCode = code.trim().toUpperCase();

  if (!couponCode) return null;

  const snap = await getDoc(doc(db, "coupons", couponCode));

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Coupon, "id">;

  if (!data.active) return null;

  return {
    id: snap.id,
    ...data,
  };
}