"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { User, Lock, LogIn, UserPlus, Sparkles, X, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Xử lý chuẩn hóa Username thành Email giả định cho Firebase
  const getSyntheticEmail = (userStr: string) => {
    const cleanUser = userStr.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    return `${cleanUser}@dokhai.shop`;
  };

  // Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // Khởi tạo document user nếu chưa tồn tại
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0],
          email: user.email,
          wallet: 0,
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err: any) {
      setError("Đăng nhập Google thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký tài khoản nhanh (Username + Mật khẩu)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanUser = username.trim().toLowerCase();
    if (cleanUser.length < 3) {
      setError("Tên tài khoản phải có ít nhất 3 ký tự!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự trở lên!");
      return;
    }

    setLoading(true);
    const syntheticEmail = getSyntheticEmail(cleanUser);

    try {
      const res = await createUserWithEmailAndPassword(auth, syntheticEmail, password);
      const user = res.user;

      // Cập nhật Tên hiển thị
      await updateProfile(user, { displayName: username.trim() });

      // Lưu tài khoản vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: cleanUser,
        displayName: username.trim(),
        wallet: 0,
        createdAt: serverTimestamp(),
      });

      alert("Đăng ký thành công! Hệ thống đã tự động đăng nhập.");
      onClose();
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Tên tài khoản này đã được sử dụng. Vui lòng chọn tên khác!");
      } else {
        setError("Đăng ký thất bại: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng Username + Mật khẩu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!");
      return;
    }

    setLoading(true);
    const syntheticEmail = getSyntheticEmail(username);

    try {
      await signInWithEmailAndPassword(auth, syntheticEmail, password);
      onClose();
    } catch (err: any) {
      setError("Tên tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> DoKhai Shop
          </h2>
          <p className="text-xs text-slate-500">Đăng nhập hoặc tạo tài khoản nhanh không cần Gmail</p>
        </div>

        {/* CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === "login" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Đăng nhập
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === "register" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Tạo tài khoản
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
        <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên tài khoản</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: vana123"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu ít nhất 6 ký tự"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-2xl transition shadow-md shadow-blue-500/20 active:scale-95 text-sm disabled:opacity-60"
          >
            {loading
              ? "Đang xử lý..."
              : tab === "login"
              ? "Đăng nhập ngay"
              : "Tạo tài khoản mới"}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400">HOẶC</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* NÚT ĐĂNG NHẬP GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl border border-slate-200 transition flex items-center justify-center gap-2 text-xs shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Đăng nhập bằng Gmail (Google)
        </button>
      </div>
    </div>
  );
}