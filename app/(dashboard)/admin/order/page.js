"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import OrderService from "@/services/OrderService";
import Link from "next/link";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await OrderService.getList({ limit, page, search });
      // Xử lý dữ liệu trả về tùy theo cấu trúc API Laravel/NodeJS
      const data = res?.data?.data || res?.data || [];
      const lastPage = res?.data?.last_page || res?.last_page || 1;

      setOrders(data);
      setTotalPages(lastPage);
    } catch (err) {
      console.error("Lỗi API:", err);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await OrderService.delete(id);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quản lý đơn hàng
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi và cập nhật trạng thái đơn hàng của hệ thống.
          </p>
        </div>

        <Link
          href="/admin/order/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Tạo đơn hàng mới</span>
        </Link>
      </div>

      {/* FILTER & TOOLS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, mã đơn..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mr-2">
            <Filter size={16} />
            <span>Hiển thị:</span>
          </div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
          >
            <option value={10}>10 dòng</option>
            <option value={20}>20 dòng</option>
            <option value={50}>50 dòng</option>
          </select>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="text-indigo-600 animate-spin" size={32} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mã ĐH
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {order.name}
                      </div>
                      <div className="text-[12px] text-slate-400">
                        ID KH: {order.user_id || "Guest"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {order.email}
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-slate-500 max-w-[200px] truncate"
                        title={order.address}
                      >
                        {order.address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 size={14} /> Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold">
                          <Clock size={14} /> Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/order/${order.id}/detail`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/order/${order.id}/edit`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => deleteItem(order.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    Không tìm thấy đơn hàng nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <p className="text-sm font-medium text-slate-500">
          Hiển thị trang <span className="text-slate-900">{page}</span> /{" "}
          <span className="text-slate-900">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 hover:text-indigo-600 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)]
              .map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    page === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 hover:text-indigo-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
