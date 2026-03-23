"use client";
import { useState, useEffect, useCallback } from "react";
import ProductService from "@/services/ProductService";
import CategoryService from "@/services/CategoryService";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Image as ImageIcon,
  Tag,
  Layers,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (n) => Number(n).toLocaleString("vi-VN") + " ₫";

  const groupAttributes = (productAttributes = []) => {
    return Object.values(
      productAttributes.reduce((acc, item) => {
        const name = item.attribute?.name;
        if (!name) return acc;
        if (!acc[name]) {
          acc[name] = { name, values: [] };
        }
        acc[name].values.push(item.value);
        return acc;
      }, {})
    );
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resProd = await ProductService.getList({ limit, page, search });
      setProducts(resProd.data || []);
      setTotalPages(resProd.last_page || 1);

      if (categories.length === 0) {
        const resCat = await CategoryService.getList({ limit: 999 });
        setCategories(resCat.data || []);
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, categories.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryName = (catId) => {
    const category = categories.find((c) => c.id === catId);
    return category ? category.name : "Chưa phân loại";
  };

  const deleteItem = async (id) => {
    if (!confirm("Xác nhận xóa sản phẩm này?")) return;
    try {
      const res = await ProductService.delete(id);
      if (res.status) {
        fetchData();
      }
    } catch (err) {
      alert("Lỗi xóa sản phẩm!");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={32} />
            Kho sản phẩm
          </h1>
          <p className="text-slate-500 font-medium">
            Quản lý danh sách, giá bán và kho hàng hệ thống
          </p>
        </div>

        <Link
          href="/admin/product/add"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 no-underline"
        >
          <Plus size={20} /> Thêm sản phẩm mới
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
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
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 outline-none font-bold text-slate-600 shadow-sm appearance-none cursor-pointer"
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
                Thông tin
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Danh mục/Thuộc tính
              </th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Giá bán
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
                  colSpan="4"
                  className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs"
                >
                  <Loader2
                    className="animate-spin mx-auto mb-4 text-indigo-500"
                    size={32}
                  />
                  Đang đồng bộ kho dữ liệu...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-20 text-center font-bold text-slate-500"
                >
                  Kho hàng hiện đang trống
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                        {p.thumbnail_url ? (
                          <img
                            src={p.thumbnail_url}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                          ID: #{p.id}
                        </span>
                        <span className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1 uppercase tracking-tight">
                          {p.name}
                        </span>
                        <span className="text-slate-400 text-xs font-medium italic">
                          slug: {p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold text-xs bg-slate-100 w-fit px-2 py-1 rounded-md">
                        <Layers size={12} className="text-indigo-400" />
                        {getCategoryName(p.category_id)}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {groupAttributes(p.product_attributes).map(
                          (attr, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold border border-indigo-100"
                            >
                              {attr.name}: {attr.values.join(", ")}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-emerald-600 tracking-tight">
                        {formatCurrency(p.price_buy)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Giá niêm yết
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <Link href={`/admin/product/${p.id}/edit`}>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteItem(p.id)}
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

        {/* PAGINATION */}
        <div className="bg-slate-50/50 px-8 py-6 flex items-center justify-between border-t border-slate-100">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            Trang <span className="text-slate-900">{page}</span> /{" "}
            <span className="text-slate-900">{totalPages}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 font-bold text-slate-600 text-xs hover:border-indigo-400 transition-all shadow-sm"
            >
              <ChevronLeft size={16} /> Trước
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 font-bold text-slate-600 text-xs hover:border-indigo-400 transition-all shadow-sm"
            >
              Sau <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
