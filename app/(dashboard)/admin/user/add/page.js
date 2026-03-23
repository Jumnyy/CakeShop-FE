"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "@/services/UserService";

const UserAdd = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    roles: "user",
    status: 1,
  });

  // ===== AVATAR =====
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  /* ================= HANDLE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("password_confirmation", form.password);
    formData.append("role", form.roles);
    formData.append("status", form.status ? 1 : 0);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await UserService.create(formData);
      if (res.data.status) {
        alert("✅ Thêm người dùng thành công");
        router.push("/admin/user");
      } else {
        alert(res.data.message || "❌ Thêm người dùng thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi xảy ra");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow">
        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-center">👤 Thêm người dùng</h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ tên"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {/* AVATAR */}
          <div>
            <label className="font-semibold text-gray-700">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="mt-2"
            />

            {previewAvatar && (
              <img
                src={previewAvatar}
                className="mt-4 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>

          {/* ROLE */}
          <select
            name="roles"
            value={form.roles}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Kích hoạt</span>
            <input
              type="checkbox"
              checked={form.status === 1}
              onChange={(e) =>
                setForm({ ...form, status: e.target.checked ? 1 : 0 })
              }
              className="w-5 h-5 accent-indigo-600"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            💾 Lưu người dùng
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAdd;
