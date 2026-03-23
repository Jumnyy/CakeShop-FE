"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath || typeof avatarPath !== "string")
    return "/images/default-avatar.png";
  if (avatarPath.startsWith("http")) return avatarPath;
  const cleanPath = avatarPath.startsWith("/")
    ? avatarPath.substring(1)
    : avatarPath;
  if (cleanPath.startsWith("uploads") || cleanPath.startsWith("storage")) {
    return `http://localhost:8000/${cleanPath}`;
  }
  return `http://localhost:8000/storage/${cleanPath}`;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(
    "/images/default-avatar.png",
  );
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
      setPreviewAvatar(getAvatarUrl(user.avatar));
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", content: "" });

    const token = localStorage.getItem("token");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("username", user.username);
      data.append("phone", formData.phone || "");
      data.append("roles", user.roles || "customer");
      data.append("status", user.status ?? 1);
      if (formData.password) data.append("password", formData.password);
      if (avatarFile) data.append("avatar", avatarFile);
      data.append("_method", "PUT");

      const response = await axios.post(
        `http://localhost:8000/api/users/${user.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setMessage({
          type: "success",
          content: "Hồ sơ đã được cập nhật tinh hoa!",
        });
        const updatedUser = response.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
        setPreviewAvatar(getAvatarUrl(updatedUser.avatar));
      }
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.message || "Cập nhật thất bại",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">
        VUI LÒNG ĐĂNG NHẬP ĐỂ TIẾP TỤC
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-amber-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={previewAvatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg border-2 border-white"
                >
                  <Camera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-800 tracking-tight">
                {formData.name}
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                @{user.username || "member"}
              </p>

              <div className="mt-6 flex gap-2">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {user.roles === "admin" ? "Administrator" : "Premium Member"}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[30px] p-6 text-white overflow-hidden relative">
              <Sparkles
                className="absolute top-4 right-4 text-amber-400 opacity-50"
                size={20}
              />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Trạng thái tài khoản
              </p>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="text-emerald-400" size={18} />
                <span className="font-bold text-sm">Đã xác thực danh tính</span>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                    CÀI ĐẶT HỒ SƠ
                  </h3>
                  <div className="h-1 w-12 bg-indigo-600 rounded-full mt-1"></div>
                </div>
                {message.content && (
                  <div
                    className={`px-4 py-2 rounded-2xl text-xs font-bold animate-bounce ${message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {message.content}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <User size={12} /> Họ và tên
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <Phone size={12} /> Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <Mail size={12} /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <Lock size={12} /> Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Để trống nếu không đổi"
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-10">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[2px] overflow-hidden transition-all hover:bg-indigo-600 disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSaving ? "Đang xử lý..." : "Lưu hồ sơ"}
                      {!isSaving && (
                        <Save
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
