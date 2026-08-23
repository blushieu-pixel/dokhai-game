
"use client";
import AdminGuard from "@/components/AdminGuard";
import { useState } from "react";
import Image from "next/image"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
const imageOptions = [
  {
    label: "Golden Dragon",
    value: "/pets/golden-dragon.jpg",
    category: "Pet",
  },
  {
    label: "Candy Blossom",
    value: "/seeds/candy-blossom.jpg",
    category: "Seed",
  },
  {
    label: "Brainrot Crate",
    value: "/items/brainrot-crate.jpg",
    category: "Item",
  },
  {
    label: "Grow a Garden",
    value: "/games/grow-a-garden.jpg",
    category: "Game",
  },
  {
    label: "Steal a Brainrot",
    value: "/games/steal-brainrot.jpg",
    category: "Game",
  },
];
export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    game: "Grow a Garden",
    category: "Pet",
    rarity: "Common",
    price: "",
    stock: "",
    image: "/games/grow-a-garden.jpg",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        name: form.name,
        game: form.game,
        category: form.category,
        rarity: form.rarity,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image,
        featured: false,
        active: true,
        createdAt: new Date(),
      });

      router.push("/admin/products");
    } catch (err) {
      alert("Có lỗi khi thêm sản phẩm.");
      console.error(err);
    }

    setLoading(false);
  }

 return (
  <AdminGuard>
    <main>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
        >
          <ArrowLeft size={18} />
          Quay lại
        </Link>

        <div className="bg-white rounded-3xl shadow p-8">
          <h1 className="text-3xl font-black text-slate-900">
            Thêm sản phẩm
          </h1>

          <p className="text-slate-500 mt-2">
            Điền thông tin để đăng bán ngay.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="font-semibold block mb-2">
                Tên sản phẩm
              </label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="Golden Dragon"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Game
              </label>

              <select
                value={form.game}
                onChange={(e) =>
                  setForm({ ...form, game: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              >
                <option>Grow a Garden</option>
                <option>Steal a Brainrot</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              >
                <option>Pet</option>
                <option>Seed</option>
                <option>Item</option>
                <option>Bundle</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Độ hiếm
              </label>

              <select
                value={form.rarity}
                onChange={(e) =>
                  setForm({ ...form, rarity: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              >
                <option>Common</option>
                <option>Rare</option>
                <option>Epic</option>
                <option>Legendary</option>
                <option>Mythic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-2">
                  Giá
                </label>

                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="w-full border rounded-2xl px-4 py-3"
                  placeholder="199000"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">
                  Tồn kho
                </label>

                <input
                  required
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  className="w-full border rounded-2xl px-4 py-3"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
  <label className="font-semibold block mb-3">
    Chọn ảnh sản phẩm
  </label>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {imageOptions.map((img) => (
      <button
        type="button"
        key={img.value}
        onClick={() =>
          setForm({ ...form, image: img.value })
        }
        className={`rounded-2xl overflow-hidden border-2 transition ${
          form.image === img.value
            ? "border-blue-500 shadow-lg"
            : "border-slate-200 hover:border-blue-300"
        }`}
      >
        <div className="relative aspect-square">
          <Image
            src={img.value}
            alt={img.label}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-3 bg-white text-left">
          <div className="font-bold text-sm">
            {img.label}
          </div>

          <div className="text-xs text-slate-500">
            {img.category}
          </div>
        </div>
      </button>
    ))}
  </div>

  <div className="mt-5 bg-slate-50 rounded-2xl p-4">
    <p className="text-sm text-slate-500 mb-3">
      Ảnh đã chọn
    </p>

    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border">
      <Image
        src={form.image}
        alt="Preview"
        fill
        className="object-cover"
      />
    </div>
  </div>
</div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition disabled:opacity-60"
            >
              {loading ? "Đang đăng..." : "Đăng sản phẩm"}
            </button>
          </form>
        </div>
      </div>
       </main>
  </AdminGuard>
);
}