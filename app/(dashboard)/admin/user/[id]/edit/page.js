"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserService from "@/services/UserService";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    roles: "user",
    avatar: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await UserService.getById(id);
        if (res.status) {
          const user = res.data?.data || res.data;
          setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            username: user.username || "",
            password: "",
            roles: user.roles || "user",
            avatar: user.avatar || "",
            status: user.status ?? 1,
          });
        }
      } catch (err) {
        console.error(err);
        alert("❌ Không tải được dữ liệu người dùng");
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        status: Number(form.status),
      };

      if (!payload.password) {
        delete payload.password;
      }

      await UserService.update(id, payload);
      alert("✅ Cập nhật người dùng thành công");
      router.push("/admin/user");
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Đang lấy dữ liệu thành viên...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON & TITLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/admin/user")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-all font-bold text-sm uppercase mb-2 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Quay lại danh sách
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Cập nhật <span className="text-indigo-600">Thành viên</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                form.status === 1
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-600 border border-rose-100"
              }`}
            >
              {form.status === 1 ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {form.status === 1 ? "Active Account" : "Blocked"}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* LEFT COLUMN: AVATAR & QUICK INFO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={
                    form.avatar ||
                    `https://ui-avatars.com/api/?name=${form.name}&background=6366f1&color=fff`
                  }
                  className="w-full h-full object-cover rounded-[2.5rem] shadow-xl shadow-indigo-100 border-4 border-white"
                  alt="Avatar"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md">
                  <ImageIcon size={18} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                {form.name || "N/A"}
              </h3>
              <p className="text-slate-400 text-sm font-medium mb-4">
                {form.email}
              </p>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                {form.roles}
              </span>
            </div>

            <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-lg shadow-indigo-200">
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">
                Ghi chú nhanh
              </h4>
              <p className="text-xs font-medium leading-relaxed opacity-90 italic">
                Việc đổi mật khẩu sẽ có hiệu lực ngay lập tức. Nếu người dùng
                đang đăng nhập, họ có thể cần đăng nhập lại.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
              {/* Section: Personal Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <User size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Thông tin cá nhân
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                      Họ và tên
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 p-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                    Email liên lạc
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 p-4 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section: Account & Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Lock size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Tài khoản & Bảo mật
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                      Tên đăng nhập
                    </label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white font-bold text-indigo-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1 text-rose-500">
                      Mật khẩu mới
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Để trống nếu giữ nguyên"
                      className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-[11px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                      Vai trò
                    </label>
                    <select
                      name="roles"
                      value={form.roles}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white font-bold text-slate-700 appearance-none"
                    >
                      <option value="admin">👑 Quản trị viên (Admin)</option>
                      <option value="user">👤 Người dùng (User)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white font-bold text-slate-700 appearance-none"
                    >
                      <option value={1}>✅ Đang hoạt động</option>
                      <option value={0}>🔒 Đang khóa tài khoản</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-[24px] font-black transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Save size={24} />
                  )}
                  LƯU THÔNG TIN THÀNH VIÊN
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
