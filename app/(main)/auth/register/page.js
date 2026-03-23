"use client";
import React, { useState } from "react";
import Link from "next/link";
import { register } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react"; // Import icon cho đẹp

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "", 
    password: "",
    confirm_password: "",
  });
  const [avatar, setAvatar] = useState(null); // Lưu file ảnh
  const [preview, setPreview] = useState(null); // Lưu link xem trước ảnh
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // Tạo link preview ảnh
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Mật khẩu nhập lại không khớp");
      setLoading(false);
      return;
    }

    try {
      // SỬ DỤNG FORMDATA ĐỂ GỬI ẢNH
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("username", formData.username);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("password_confirmation", formData.confirm_password);
      if (avatar) {
        data.append("avatar", avatar);
      }

      const res = await register(data); // Đảm bảo hàm register trong AuthService nhận FormData

      alert("Đăng ký thành công!");
      router.push("/auth/signin");
    } catch (err) {
      setError(err.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-md p-8 rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 uppercase text-center">
          Đăng ký
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-sm font-medium bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* CHOOSE AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-2">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-gray-400" size={32} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800 shadow-lg">
                <Camera size={14} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              Chọn ảnh đại diện
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Họ và tên *
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tên đăng nhập *
              </label>
              <input
                name="username"
                type="text"
                required
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Số điện thoại *
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="09xxx..."
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Mật khẩu *
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Nhập lại mật khẩu */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nhập lại mật khẩu *
              </label>
              <input
                name="confirm_password"
                type="password"
                required
                className="w-full border border-gray-200 h-11 px-3 rounded-sm focus:border-black outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
          </button>

          <div className="text-sm flex justify-between mt-4">
            <span>Đã có tài khoản?</span>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
