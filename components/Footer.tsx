
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-black text-blue-600">
              DoKhai Game
            </h3>

            <p className="text-slate-500 mt-3">
              Shop vật phẩm Roblox uy tín dành cho Grow a Garden 2 và Steal a
              Brainrot.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Liên hệ</h4>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                Zalo hỗ trợ
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                Messenger
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Thanh toán</h4>

            <div className="space-y-2 text-slate-600">
              <div>💳 PayOS</div>
              <div>🏦 VietQR</div>
              <div>📱 Thẻ cào</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 text-center text-slate-500 text-sm">
          © 2026 DoKhai Game
        </div>
      </div>
    </footer>
  );
}