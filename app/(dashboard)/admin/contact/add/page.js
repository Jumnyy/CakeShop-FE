"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ContactService from "@/services/ContactService";

const ContactAdd = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        user_id: "",
        name: "",
        email: "",
        phone: "",
        content: "",
        status: 1,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                user_id: form.user_id ? Number(form.user_id) : null,
                name: form.name,
                email: form.email,
                phone: form.phone,
                content: form.content,
                status: Number(form.status),
            };

            const res = await ContactService.create(payload);

            if (res.data.status) {
                alert("✅ Thêm liên hệ thành công");
                router.push("/admin/contact");
            } else {
                alert(res.data.message || "❌ Thêm liên hệ thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra");
        }
    };

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6 flex justify-center items-start">
    <div className="w-full max-w-2xl">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <h4 className="text-2xl font-extrabold text-center">
            📩 Thêm Liên Hệ Mới
          </h4>
        </div>

        {/* BODY */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="number"
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              placeholder="User ID (nếu có)"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Họ tên"
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Nội dung liên hệ"
              rows={4}
              required
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value={1}>✅ Mới</option>
              <option value={0}>❌ Đã xử lý</option>
            </select>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-emerald-500 to-teal-600
                hover:scale-105 transition shadow-lg"
            >
              💾 Lưu Liên Hệ
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default ContactAdd;
    