"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Hash,
  Layers,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import TopicService from "@/services/TopicService";

export default function TopicPage() {
  const [topics, setTopics] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await TopicService.getList({ limit, page, search });
      setTopics(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (err) {
      console.error("Lỗi API:", err);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const deleteItem = async (id) => {
    if (!confirm("Xác nhận xóa chủ đề này?")) return;
    try {
      const res = await TopicService.delete(id);
      if (res.status) {
        fetchTopics();
      }
    } catch (err) {
      alert("Lỗi xóa chủ đề!");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Layers className="text-indigo-600" size={32} />
            Quản lý chủ đề
          </h1>
          <p className="text-slate-500 font-medium">
            Phân loại và tổ chức nội dung bài viết hệ thống
          </p>
        </div>

        <Link
          href="/admin/topic/add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 no-underline"
        >
          <Plus size={20} /> Thêm chủ đề mới
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên chủ đề hoặc slug..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-slate-700 font-medium shadow-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 outline-none font-bold text-slate-600 shadow-sm"
          >
            <option value={10}>Hiển thị 10 dòng</option>
            <option value={20}>Hiển thị 20 dòng</option>
            <option value={50}>Hiển thị 50 dòng</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Chủ đề
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                Thứ tự
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs"
                >
                  Đang tải danh mục...
                </td>
              </tr>
            ) : topics.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-20 text-center font-bold text-slate-500"
                >
                  Không có chủ đề nào được tìm thấy
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-slate-300" />
                      <span className="font-mono text-slate-400 font-bold">
                        {topic.id}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {topic.name}
                      </span>
                      <span className="text-slate-400 text-xs font-medium italic">
                        /{topic.slug}
                      </span>
                      <p className="text-slate-400 text-xs mt-1 max-w-[200px] truncate">
                        {topic.description || "Không có mô tả"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-black text-xs">
                      {topic.sort_order}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {topic.status === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Ẩn
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/topic/${topic.id}/edit`}>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteItem(topic.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION BOTTOM */}
        <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            Trang <span className="text-slate-900">{page}</span> /{" "}
            <span className="text-slate-900">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-indigo-400 transition-all text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-indigo-400 transition-all text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
