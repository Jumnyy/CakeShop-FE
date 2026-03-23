"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TopicService from "@/services/TopicService";
import Link from "next/link";
import {
  Save,
  ChevronLeft,
  Settings2,
  Loader2,
  Type,
  Hash,
  AlignLeft,
} from "lucide-react";

export default function EditTopic() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    sort_order: 0,
    description: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // 1. LOAD TOPIC DETAIL
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await TopicService.getById(id);
        // Xử lý dữ liệu linh hoạt tùy vào cấu trúc response của Laravel
        const topic = res.data?.data || res.data;

        if (topic) {
          setForm({
            name: topic.name || "",
            sort_order: topic.sort_order ?? 0,
            description: topic.description || "",
            status: topic.status ?? 1,
          });
        }
      } catch (err) {
        console.error(err);
        alert("❌ Không tải được dữ liệu chủ đề");
      } finally {
        setIsFetching(false);
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
        name: form.name,
        sort_order: Number(form.sort_order),
        description: form.description,
        status: Number(form.status),
      };

      await TopicService.update(id, payload);
      alert("✅ Cập nhật chủ đề thành công");
      router.push("/admin/topic");
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật chủ đề thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Đang tải dữ liệu chủ đề...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 lg:p-10 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/topic"
            className="flex items-center gap-2 text-sky-500 hover:text-emerald-700 transition-colors font-bold text-sm uppercase mb-2"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Sửa Chủ Đề: <span className="text-sky-600">#{id}</span>
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-sky-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Lưu Thay Đổi
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Type size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Nội dung hiển thị
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
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CẤU HÌNH */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Settings2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Cài đặt hệ thống
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 flex items-center gap-1">
                <Hash size={14} /> Thứ tự sắp xếp
              </label>
              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 flex items-center gap-1">
                <AlignLeft size={14} /> Trạng thái
              </label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 1 })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    form.status == 1
                      ? "bg-white text-gray-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  HIỆN
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
                  ẨN
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 italic">
            <p className="text-[11px] text-sky-600 font-bold uppercase tracking-wider leading-relaxed">
              * Lưu ý: Khi ẩn chủ đề, các bài viết thuộc chủ đề này có thể sẽ
              không hiển thị trên menu chính của website.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
