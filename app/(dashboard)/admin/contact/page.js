"use client";

import { useEffect, useState } from "react";
import ContactService from "@/services/ContactService";
import Link from "next/link";
import {
  Search,
  Trash2,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  User,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [limit, page, search]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await ContactService.getList({ limit, page, search });
      setContacts(res.data || []);
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
    if (!confirm("⚠️ Bạn có chắc muốn xóa yêu cầu liên hệ này?")) return;
    try {
      const res = await ContactService.delete(id);
      if (res.status) {
        setContacts(contacts.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa liên hệ!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-pink-600 rounded-xl text-white shadow-lg shadow-pink-100">
                <Mail size={28} />
              </div>
              Quản lý Liên hệ
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Lắng nghe ý kiến và hỗ trợ khách hàng của bạn
            </p>
          </div>

          <Link href="/admin/contact/add">
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-200">
              <Plus size={20} />
              Tạo Liên Hệ Mới
            </button>
          </Link>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email khách hàng..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-slate-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Dòng:
            </span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-slate-50 border-none px-4 py-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-pink-600" size={40} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Thông điệp
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {contacts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-black text-slate-700">
                          <User size={14} className="text-pink-500" />
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Mail size={12} /> {item.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={12} /> {item.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-[400px]">
                        <MessageSquare
                          size={16}
                          className="text-slate-300 shrink-0 mt-1"
                        />
                        <div>
                          <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                            {item.content}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
                            ID: #{item.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {item.status === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black border border-emerald-100">
                          <CheckCircle size={14} /> ĐÃ XỬ LÝ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100 animate-pulse">
                          <Clock size={14} /> ĐANG CHỜ
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/contact/${item.id}/edit`}>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
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
          <p className="text-slate-500 font-bold text-sm bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            Trang <span className="text-pink-600">{page}</span> / {totalPages}
          </p>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
