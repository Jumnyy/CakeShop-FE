"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Product_storeService from "@/services/Product_storeService";

export default function EditProductStore() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    product_id: "",
    price_root: "",
    qty: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD PRODUCT_STORE DETAIL
  // =========================
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await Product_storeService.getById(id);

        // res = { status: true, data: {...} }
        if (res.status) {
          const store = res.data;

          setForm({
            product_id: store.product_id,
            price_root: store.price_root,
            qty: store.qty,
            status: store.status,
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // SUBMIT UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        product_id: Number(form.product_id),
        price_root: Number(form.price_root),
        qty: Number(form.qty),
        status: Number(form.status),
      };

      await Product_storeService.update(id, payload);

      alert("Cập nhật kho thành công");
      router.push("/admin/product_store");
    } catch (err) {
      console.error(err.response?.data);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          📦 Cập nhật kho sản phẩm
        </h1>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
        >
          ⬅ Quay lại
        </button>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product ID */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              ID sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Price Root */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Giá gốc <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price_root"
              value={form.price_root}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="qty"
              value={form.qty}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition font-semibold"
            >
              Hủy
            </button>

            <button
              disabled={loading}
              className="px-6 py-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-emerald-500 to-teal-600
              hover:scale-105 transition shadow-lg
              disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "⏳ Đang cập nhật..." : "💾 Cập nhật kho"}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}
