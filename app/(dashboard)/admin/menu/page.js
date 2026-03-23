"use client";

import { useEffect, useState } from "react";
import MenuService from "@/services/MenuService";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Layout,
  Layers,
  ListOrdered,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, [limit, page, search]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await MenuService.getList({ limit, page, search });
      setMenus(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (err) {
      console.error("Lỗi API MENU:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const deleteItem = async (id) => {
    if (
      !confirm(
        "⚠️ Bạn có chắc muốn xóa menu này? Hành động này không thể hoàn tác."
      )
    )
      return;

    try {
      const res = await MenuService.delete(id);
      if (res.status) {
        setMenus((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa menu!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="max-w-[1400px] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Layout className="text-indigo-600" size={36} />
            Quản lý Menu
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Điều hướng và cấu trúc hệ thống website
          </p>
        </div>

        <Link href="/admin/menu/add">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95">
            <Plus size={20} />
            Thêm Menu Mới
          </button>
        </Link>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="max-w-[1400px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm tên menu hoặc đường dẫn..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Hiển thị:
          </span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-slate-50 border-none px-4 py-3 rounded-xl font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>10 dòng</option>
            <option value={20}>20 dòng</option>
            <option value={50}>50 dòng</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                  ID
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                  Thông tin Menu
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                  Cấu trúc
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                  Vị trí
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
                  Trạng thái
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.1em] text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {menus.length > 0 ? (
                menus.map((menu) => (
                  <tr
                    key={menu.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-bold text-slate-400">
                        #{menu.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 text-lg leading-tight">
                          {menu.name}
                        </span>
                        <span className="text-indigo-500 font-medium text-sm mt-1">
                          {menu.link}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Layers size={14} className="text-slate-300" />
                          Type:{" "}
                          <span className="text-slate-700 uppercase">
                            {menu.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <ListOrdered size={14} className="text-slate-300" />
                          Sort:{" "}
                          <span className="text-slate-700">
                            {menu.sort_order}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-tighter">
                        {menu.position}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {menu.status === 1 ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Công khai
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                          Đang ẩn
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all">
                          <Eye size={18} />
                        </button>
                        <Link href={`/admin/menu/${menu.id}/edit`}>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-white hover:text-amber-500 hover:shadow-md transition-all">
                            <Edit3 size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteItem(menu.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-slate-100 p-4 rounded-full text-slate-300">
                        <Layout size={48} />
                      </div>
                      <p className="text-slate-400 font-bold">
                        Không tìm thấy dữ liệu menu nào
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION SECTION */}
      <div className="max-w-[1400px] mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 font-bold text-sm">
          Hiển thị trang <span className="text-indigo-600">{page}</span> trên
          tổng số <span className="text-indigo-600">{totalPages}</span> trang
        </p>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1 px-4">
            <span className="font-black text-indigo-600">{page}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
