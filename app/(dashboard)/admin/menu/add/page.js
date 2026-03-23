"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MenuService from "@/services/MenuService";
import Link from "next/link";
import {
  Save,
  ChevronLeft,
  LayoutGrid,
  Link as LinkIcon,
  Type,
  Settings,
  Loader2,
  Anchor,
} from "lucide-react";

const MenuAdd = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    link: "",
    position: "mainmenu",
    status: 1, // Để mặc định là 1 (Hiển thị) sẽ tiện hơn
  });

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
        name: form.name,
        link: form.link,
        position: form.position,
        status: Number(form.status),
      };

      const res = await MenuService.create(payload);

      if (res.status) {
        alert("✅ Thêm menu thành công");
        router.push("/admin/menu");
      } else {
        alert(res.data.message || "❌ Thêm menu thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra trong quá trình lưu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* NÚT QUAY LẠI & TIÊU ĐỀ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-bold text-sm uppercase mb-2"
          >
            <ChevronLeft size={16} /> Danh sách Menu
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-teal-600" size={32} />
            Tạo Menu Mới
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: THÔNG TIN CƠ BẢN */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Type size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Nội dung hiển thị
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">
                Tên nhãn Menu
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Trang chủ, Sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-1 flex items-center gap-1">
                <LinkIcon size={14} /> Đường dẫn (Link)
              </label>
              <input
                type="text"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="/san-pham"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-600"
                required
              />
            </div>
          </div>
        </div>

        {/* CARD 2: CẤU HÌNH HỆ THỐNG */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-6">
            <Settings size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Thiết lập vị trí & Trạng thái
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vị trí */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1 flex items-center gap-1">
                <Anchor size={14} /> Vị trí hiển thị
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, position: "mainmenu" })}
                  className={`py-3 rounded-xl text-xs font-black transition-all ${
                    form.position === "mainmenu"
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  MAIN MENU
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, position: "footermenu" })}
                  className={`py-3 rounded-xl text-xs font-black transition-all ${
                    form.position === "footermenu"
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  FOOTER
                </button>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">
                Trạng thái hoạt động
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-bold text-slate-700 appearance-none focus:bg-white"
              >
                <option value={1}>✅ Đang hiển thị</option>
                <option value={0}>❌ Tạm ẩn</option>
              </select>
            </div>
          </div>
        </div>

        {/* NÚT LƯU */}
        <div className="flex pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white px-8 py-5 rounded-[24px] font-black transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Save size={24} />
            )}
            LƯU THÔNG TIN MENU
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs font-medium italic">
          * Lưu ý: Hãy kiểm tra kỹ đường dẫn để đảm bảo khách hàng không gặp lỗi
          404.
        </p>
      </form>
    </div>
  );
};

export default MenuAdd;
