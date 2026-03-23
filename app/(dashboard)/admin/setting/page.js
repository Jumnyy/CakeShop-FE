"use client";

import { useEffect, useState } from "react";
import SettingService from "@/services/SettingService";
import Link from "next/link";
import {
  Settings,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  ShieldCheck,
  EyeOff,
} from "lucide-react";

export default function SettingPage() {
  const [settings, setSettings] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, [limit, page, search]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await SettingService.getList({ limit, page, search });
      setSettings(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (err) {
      console.error("Lỗi API:", err);
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
        "⚠️ Bạn có chắc muốn xóa cấu hình này? Hệ thống có thể bị ảnh hưởng!"
      )
    )
      return;
    try {
      const res = await SettingService.delete(id);
      if (res.status) {
        setSettings((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa cấu hình!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-100">
                <Settings size={28} />
              </div>
              Cấu hình Website
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Thiết lập thông tin thương hiệu và thông tin liên hệ chính thức
            </p>
          </div>

          <Link href="/admin/setting/add">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-emerald-200">
              <Plus size={20} />
              Thêm Cấu Hình
            </button>
          </Link>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên website..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">
              Hiển thị:
            </span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-slate-50 border-none px-4 py-3 rounded-xl font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Thông tin chung
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Liên hệ & Hotline
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Trạng thái
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {settings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-black text-sm">
                            #{item.id}
                          </span>
                          <span className="font-black text-slate-700 group-hover:text-emerald-700 transition-colors">
                            {item.site_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic">
                          <Globe size={12} /> config_v1.0
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Mail size={14} className="text-slate-300" />{" "}
                          {item.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                          <Phone size={14} className="text-emerald-500" />{" "}
                          {item.phone}
                          <span className="mx-1 text-slate-300">|</span>
                          <span className="text-rose-500 font-black">
                            {item.hotline}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-[250px]">
                        <MapPin
                          size={16}
                          className="text-slate-300 shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                          {item.address}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {item.status === 1 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black border border-emerald-100">
                          <ShieldCheck size={14} /> HIỂN THỊ
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[11px] font-black border border-slate-200">
                          <EyeOff size={14} /> ĐANG ẨN
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/setting/${item.id}/edit`}>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white hover:rotate-12 transition-all shadow-sm">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white hover:-rotate-12 transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Trang <span className="text-emerald-600 text-lg">{page}</span> /{" "}
            {totalPages}
          </p>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-3 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-3 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
