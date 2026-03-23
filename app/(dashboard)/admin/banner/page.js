"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import BannerService from "@/services/BannerService";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Tăng mặc định lên 10 cho đầy đặn
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/200x100?text=No+Image";
    if (path.startsWith("http")) return path;
    const backendUrl = "http://localhost:8000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${backendUrl}${cleanPath}`;
  };

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await BannerService.getList({
        page: page,
        limit: limit,
        search: debouncedSearch,
      });

      let data = [];
      if (res && res.data) {
        data = Array.isArray(res.data) ? res.data : res.data.data || [];
        if (res.total || res.data.total) {
          setTotal(res.total || res.data.total);
        }
      } else if (Array.isArray(res)) {
        data = res;
      }
      setBanners(data);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa banner này?")) return;
    try {
      await BannerService.delete(id);
      fetchBanners();
    } catch (e) {
      alert("Lỗi khi xóa!");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Banner Ads
          </h1>
          <p className="text-slate-500 font-medium">
            Quản lý không gian quảng cáo và truyền thông
          </p>
        </div>

        <Link
          href="/admin/banner/add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 no-underline"
        >
          <Plus size={20} /> Thêm banner mới
        </Link>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên banner..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="md:col-span-4 flex gap-3">
          <div className="relative flex-1">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 outline-none appearance-none font-bold text-slate-600 cursor-pointer hover:border-slate-300 shadow-sm"
            >
              <option value="5">Hiển thị 5 dòng</option>
              <option value="10">Hiển thị 10 dòng</option>
              <option value="20">Hiển thị 20 dòng</option>
            </select>
          </div>
        </div>
      </div>

      {/* MODERN TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                Mã ID
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                Thông tin Banner
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                Vị trí
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
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
                <td colSpan="5" className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-indigo-500 mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Đang đồng bộ dữ liệu...
                  </p>
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-500 font-bold">
                    Không tìm thấy dữ liệu phù hợp
                  </p>
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-400 font-bold">
                      #{banner.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative group/img overflow-hidden rounded-xl border border-slate-200 shadow-sm w-28 h-14 bg-slate-100 shrink-0">
                        <img
                          src={getImageUrl(banner.image || banner.image_url)}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                          {banner.name}
                        </span>
                        {banner.link && (
                          <a
                            href={banner.link}
                            target="_blank"
                            className="text-indigo-400 hover:text-indigo-600 text-xs font-semibold flex items-center gap-1 mt-1 no-underline"
                          >
                            <ExternalLink size={12} /> Truy cập đích
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center font-bold">
                    <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs uppercase tracking-tighter">
                      {banner.position || "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {banner.status === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đang hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Đã tạm ẩn
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/admin/banner/${banner.id}/edit`}>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(banner.id)}
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
            Hiển thị <span className="text-slate-900">{banners.length}</span>{" "}
            trên <span className="text-slate-900">{total}</span> kết quả
          </p>

          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-white hover:border-indigo-400 transition-all text-slate-600"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center px-4 font-black text-slate-700 text-sm">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-white hover:border-indigo-400 transition-all text-slate-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .no-underline {
          text-decoration: none !important;
        }
      `}</style>
    </div>
  );
}
