"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SettingService from "@/services/SettingService";

const SettingAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        site_name: "",
        email: "",
        phone: "",
        hotline: "",
        address: "",
        status: 1,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                status: Number(form.status),
            };

            const res = await SettingService.create(payload);

            if (res.data.status) {
                alert("✅ Thêm cài đặt thành công");
                router.push("/admin/setting");
            } else {
                alert(res.data.message || "❌ Thêm thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6 flex justify-center items-start">
    <div className="w-full max-w-2xl">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <h4 className="text-2xl font-extrabold text-center">⚙️ Thêm Cài Đặt Website</h4>
        </div>

        {/* BODY */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              name="site_name"
              value={form.site_name}
              onChange={handleChange}
              placeholder="Tên website"
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              name="hotline"
              value={form.hotline}
              onChange={handleChange}
              placeholder="Hotline"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value={1}>✅ Hoạt động</option>
              <option value={0}>❌ Tắt</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-emerald-500 to-teal-600
                hover:scale-105 transition shadow-lg"
            >
              {loading ? "⏳ Đang lưu..." : "💾 Lưu Cài Đặt"}
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default SettingAdd;
