"use client";
import { useEffect, useState } from "react";
import Product_storeService from "@/services/Product_storeService";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

export default function ProductStorePage() {
  const [stores, setStores] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await Product_storeService.getList({ limit, page, search });
        setStores(res.data || []);
        setTotalPages(Math.ceil((res.total || 0) / limit));
      } catch (err) {
        console.error("Lỗi API:", err);
      }
    })();
  }, [limit, page, search]);

  const deleteItem = (id) => {
    if (confirm("Bạn có chắc muốn xóa kho sản phẩm này?")) {
      Product_storeService.delete(id)
        .then(() => {
          alert("Xóa thành công!");
          setStores(stores.filter((item) => item.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Package size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Quản lý kho hàng
            </h2>
          </div>
          <button
            onClick={() => (window.location.href = "/admin/product_store/add")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-medium">
              Hiển thị:
            </span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>
        </div>
      </div>
      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">
                  Số lượng
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Giá nhập
                </th>
                {/* ĐỔI TRẠNG THÁI THÀNH THÀNH TIỀN */}
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Thành tiền
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stores.map((item) => {
                // Tính tổng tiền cho từng dòng
                const totalAmount = item.qty * item.price_root;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">
                        {item.product_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        SKU: ST-{item.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm">
                        {item.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {item.price_root.toLocaleString("vi-VN")}₫
                    </td>

                    {/* CỘT TỔNG TIỀN MỚI */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {totalAmount.toLocaleString("vi-VN")}₫
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/product_store/${item.id}/edit`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ... phần phân trang giữ nguyên */}
      </div>{" "}
    </div>
  );
}
