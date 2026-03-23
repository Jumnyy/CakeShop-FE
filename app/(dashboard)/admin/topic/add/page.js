"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopicService from "@/services/TopicService";
import {
  Save,
  ChevronLeft,
  FolderPlus,
  LayoutList,
  Settings2,
  Loader2,
  Type,
} from "lucide-react";
import Link from "next/link";

const TopicAdd = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sort_order: 0,
    description: "",
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
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        sort_order: Number(form.sort_order),
        description: form.description,
        status: Number(form.status),
      };

      const res = await TopicService.create(payload);

      if (res.data.status) {
        alert("✅ Thêm chủ đề thành công");
        router.push("/admin/topic");
      } else {
        alert(res.data.message || "❌ Thêm chủ đề thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-10 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/topic"
            className="flex items-center gap-2 text-indigo-500 hover:text-indigo-700 transition-colors font-bold text-sm uppercase tracking-tight mb-2"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FolderPlus className="text-indigo-600" size={32} />
            Tạo Chủ Đề Mới
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Lưu Chủ Đề
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* CỘT TRÁI: THÔNG TIN NỘI DUNG */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Type size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Nội dung cơ bản
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Tên chủ đề
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tin tức, Khuyến mãi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Mô tả chủ đề
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn về nhóm bài viết thuộc chủ đề này..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CẤU HÌNH HỆ THỐNG */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Settings2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Cấu hình
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 flex items-center gap-1">
                <LayoutList size={14} /> Thứ tự sắp xếp
              </label>
              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-slate-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                Trạng thái hiển thị
              </label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 1 })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    form.status == 1
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  CÔNG KHAI
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 0 })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    form.status == 0
                      ? "bg-white text-slate-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  TẠM ẨN
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
            <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider leading-relaxed">
              * Chủ đề sẽ được dùng để phân loại bài viết. Thứ tự nhỏ hơn sẽ
              được ưu tiên hiển thị trước trên menu.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TopicAdd;
