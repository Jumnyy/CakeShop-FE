"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  Layers,
  Timer,
  AlertCircle,
  CheckCircle2,
  History,
  Loader2,
} from "lucide-react";
import ProductSaleService from "@/services/ProductSaleService";
import Link from "next/link";

export default function PromotionPage() {
  const [promos, setPromos] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CALL API
  // ==========================
  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ProductSaleService.getList({ limit, page, search });
      if (res.status) {
        setPromos(res.data || []);
        setTotalPages(Math.ceil(res.total / limit) || 1);
      }
    } catch (err) {
      console.error("API lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa chương trình khuyến mãi này?")) return;
    try {
      const res = await ProductSaleService.delete(id);
      if (res.status) {
        fetchPromos();
      }
    } catch (err) {
      alert("Lỗi xóa dữ liệu!");
    }
  };

  // ==========================
  // STATUS BADGE RENDERER
  // ==========================
  const renderStatus = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate)
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase">
          <Timer size={12} /> Sắp diễn ra
        </span>
      );
    if (now > endDate)
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase font-mono">
          <History size={12} /> Đã kết thúc
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Đang chạy
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarClock className="text-indigo-600" size={32} />
            Chương trình Khuyến mãi
          </h1>
          <p className="text-slate-500 font-medium">
            Theo dõi và tối ưu hóa các chiến dịch ưu đãi
          </p>
        </div>

        <Link
          href="/admin/productsale/add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 no-underline"
        >
          <Plus size={20} /> Tạo khuyến mãi mới
        </Link>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên chiến dịch..."
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
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 outline-none font-bold text-slate-600 shadow-sm cursor-pointer"
          >
            <option value={5}>Hiển thị 5 dòng</option>
            <option value={10}>Hiển thị 10 dòng</option>
            <option value={20}>Hiển thị 20 dòng</option>
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
                Chiến dịch
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Sản phẩm áp dụng
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Thời gian hiệu lực
              </th>
              <th className="px-6 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-indigo-500 mb-4"
                    size={32}
                  />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Đang quét dữ liệu khuyến mãi...
                  </p>
                </td>
              </tr>
            ) : promos.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <AlertCircle
                    className="mx-auto text-slate-300 mb-2"
                    size={40}
                  />
                  <p className="text-slate-500 font-bold">
                    Hiện không có chương trình ưu đãi nào
                  </p>
                </td>
              </tr>
            ) : (
              promos.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-400 font-bold">
                      #{p.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </span>
                      {renderStatus(p.date_begin, p.date_end)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-black text-xs">
                      <Layers size={14} />
                      {p.products_count || p.items_count || 0} Sản phẩm
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-400 font-bold uppercase text-[9px]">
                          Từ:
                        </span>
                        <span className="font-semibold text-slate-700">
                          {new Date(p.date_begin).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-400 font-bold uppercase text-[9px]">
                          Đến:
                        </span>
                        <span className="font-semibold text-slate-700">
                          {new Date(p.date_end).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/productsale/${p.id}/edit`}>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
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
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-indigo-400 transition-all text-slate-600 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-indigo-400 transition-all text-slate-600 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
