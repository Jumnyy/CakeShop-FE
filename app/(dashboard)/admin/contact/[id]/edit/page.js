"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ContactService from "@/services/ContactService";

export default function EditContact() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        content: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD CONTACT DETAIL
    // =========================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await ContactService.getById(id);

                if (res.status) {
                    const contact = res.data;

                    setForm({
                        user_id: contact.user_id ?? "",
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone || "",
                        content: contact.content,
                        status: contact.status,
                    });
                }
            } catch (err) {
                console.error(err);
                alert("❌ Không tải được dữ liệu liên hệ");
            }
        })();
    }, [id]);

    // =========================
    // HANDLE CHANGE
    // =========================
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
                user_id: form.user_id ? Number(form.user_id) : null,
                name: form.name,
                email: form.email,
                phone: form.phone,
                content: form.content,
                status: Number(form.status),
            };

            await ContactService.update(id, payload);

            alert("✅ Cập nhật liên hệ thành công");
            router.push("/admin/contact");
        } catch (err) {
            console.error(err);
            alert("❌ Cập nhật liên hệ thất bại");
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
          ✏️ Cập nhật liên hệ
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

          {/* User ID */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              User ID (nếu có)
            </label>
            <input
              type="number"
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Nội dung liên hệ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
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
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value={1}>Mới</option>
              <option value={0}>Đã xử lý</option>
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
              {loading ? "⏳ Đang cập nhật..." : "💾 Cập nhật liên hệ"}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}
