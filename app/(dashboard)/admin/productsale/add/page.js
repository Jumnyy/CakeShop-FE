"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductService from "@/services/ProductService";
import ProductSaleService from "@/services/ProductSaleService";
import Link from "next/link";
import {
  Save,
  X,
  Plus,
  Clock,
  Tag,
  Search,
  Trash2,
  CalendarClock,
  Gift,
  AlertCircle,
  ChevronLeft,
  Percent,
  Banknote,
  Loader2,
  PackageSearch,
} from "lucide-react";

export default function CreateProductSale() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(20);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await ProductService.getList({ limit: 9999, status: 1 });
        setProducts(res.data || []);
      } catch (e) {
        console.error("Lỗi load sản phẩm:", e);
      }
    })();
  }, []);

  const applyDiscountAll = () => {
    const updated = selectedItems.map((item) => {
      const price = Number(item.price_original);
      let price_sale = price;
      if (discountType === "percent") {
        price_sale = Math.max(0, price - (price * Number(discountValue)) / 100);
      } else {
        price_sale = Math.max(0, price - Number(discountValue));
      }
      return { ...item, price_sale: Math.round(price_sale) };
    });
    setSelectedItems(updated);
  };

  const addProduct = (product) => {
    if (selectedItems.some((i) => i.product_id === product.id)) return;
    setSelectedItems([
      ...selectedItems,
      {
        product_id: product.id,
        name: product.name,
        sku: product.sku || "N/A",
        price_original: Number(product.price_buy),
        price_sale: Number(product.price_buy),
      },
    ]);
    setShowPopup(false);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((i) => i.product_id !== id));
  };

  const updateItemPrice = (id, value) => {
    setSelectedItems(
      selectedItems.map((i) =>
        i.product_id === id ? { ...i, price_sale: Number(value) } : i
      )
    );
  };

  const totalReduce = selectedItems.reduce(
    (sum, item) => sum + (item.price_original - item.price_sale),
    0
  );

  const handleSubmit = async () => {
    if (!name || !dateBegin || !dateEnd || selectedItems.length === 0) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn ít nhất 1 sản phẩm!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: name,
        date_begin: dateBegin.replace("T", " ") + ":00",
        date_end: dateEnd.replace("T", " ") + ":00",
        products: selectedItems.map((item) => ({
          product_id: Number(item.product_id),
          price_sale: Number(item.price_sale),
          qty: 1,
        })),
      };
      const res = await ProductSaleService.create(payload);
      if (res && (res.status === true || res.data?.status === true)) {
        router.push("/admin/productsale");
      }
    } catch (error) {
      alert("Thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in duration-500">
      {/* TOP NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/productsale"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Gift className="text-orange-500" size={32} /> Thiết lập khuyến mãi
            mới
          </h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Lưu chương trình
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> Cấu hình thời gian
            </h2>

            <div className="space-y-5">
              <div className="group">
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Tên chiến dịch
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700 placeholder:font-normal"
                  placeholder="VD: Xả hàng hè 2024..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-600"
                    value={dateBegin}
                    onChange={(e) => setDateBegin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-600"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex gap-3 mt-4">
                <AlertCircle size={20} className="text-orange-500 shrink-0" />
                <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                  Hệ thống sẽ tự động cập nhật giá bán dựa trên thời gian thực.
                  Sau khi kết thúc, giá sản phẩm sẽ quay về mặc định.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: PRODUCT SELECTION */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={16} className="text-indigo-500" /> Sản phẩm áp dụng
              </h2>
              <button
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {/* QUICK TOOLBAR */}
            <div className="p-6 bg-white border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Thiết lập nhanh cho tất cả:
                </span>
                <div className="flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200">
                  <button
                    onClick={() => setDiscountType("percent")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      discountType === "percent"
                        ? "bg-white shadow text-indigo-600"
                        : "text-slate-500"
                    }`}
                  >
                    % Giảm
                  </button>
                  <button
                    onClick={() => setDiscountType("amount")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      discountType === "amount"
                        ? "bg-white shadow text-indigo-600"
                        : "text-slate-500"
                    }`}
                  >
                    đ Tiền mặt
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-indigo-600 outline-none focus:border-indigo-500"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                    {discountType === "percent" ? "%" : "đ"}
                  </span>
                </div>
                <button
                  onClick={applyDiscountAll}
                  className="text-xs font-black text-white bg-slate-800 px-4 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                >
                  Áp dụng nhanh
                </button>
              </div>
            </div>

            {/* PRODUCT LIST TABLE */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                    <th className="px-6 py-4 text-left">Sản phẩm</th>
                    <th className="px-6 py-4 text-right w-32">Giá gốc</th>
                    <th className="px-6 py-4 text-right w-48">
                      Giá khuyến mãi
                    </th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <PackageSearch
                          className="mx-auto text-slate-200 mb-4"
                          size={48}
                        />
                        <p className="text-slate-400 font-bold text-sm tracking-tight">
                          Chưa có sản phẩm nào được chọn
                        </p>
                        <p className="text-slate-300 text-xs mt-1">
                          Vui lòng bấm nút + để bắt đầu thêm hàng hóa
                        </p>
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((item) => {
                      const discountPercent = Math.round(
                        ((item.price_original - item.price_sale) /
                          item.price_original) *
                          100
                      );
                      const isError = item.price_sale > item.price_original;

                      return (
                        <tr
                          key={item.product_id}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                SKU: {item.sku}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-slate-400 text-sm">
                              {item.price_original.toLocaleString()}đ
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="relative group/input">
                                <input
                                  type="number"
                                  className={`w-36 text-right font-black p-2.5 rounded-xl border transition-all outline-none ${
                                    isError
                                      ? "border-red-400 bg-red-50 text-red-600 ring-2 ring-red-100"
                                      : "border-slate-200 bg-white focus:border-emerald-500 text-emerald-600"
                                  }`}
                                  value={item.price_sale}
                                  onChange={(e) =>
                                    updateItemPrice(
                                      item.product_id,
                                      e.target.value
                                    )
                                  }
                                />
                                <span
                                  className={`absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] font-black px-2 py-1 rounded-md ${
                                    isError
                                      ? "bg-red-100 text-red-600"
                                      : "bg-emerald-100 text-emerald-600"
                                  }`}
                                >
                                  {discountPercent}%
                                </span>
                              </div>
                              {isError && (
                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">
                                  Giá sale cao hơn giá gốc!
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAL FOOTER */}
            {selectedItems.length > 0 && (
              <div className="p-8 bg-slate-900 border-t border-slate-800">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[3px]">
                      Số lượng sản phẩm
                    </span>
                    <span className="text-white text-2xl font-black">
                      {selectedItems.length}{" "}
                      <span className="text-slate-500 text-sm">Items</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[3px]">
                      Ưu đãi dự kiến (Sum)
                    </span>
                    <div className="text-white text-3xl font-black tracking-tight">
                      - {totalReduce.toLocaleString()}
                      <span className="text-indigo-400 ml-1 italic text-xl">
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* POPUP SELECTION (MODERN DESIGN) */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <PackageSearch className="text-indigo-600" /> Chọn mặt hàng
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-white">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((product) => {
                  const isSelected = selectedItems.some(
                    (i) => i.product_id === product.id
                  );
                  return (
                    <div
                      key={product.id}
                      className={`p-4 flex justify-between items-center rounded-2xl transition-all ${
                        isSelected
                          ? "bg-slate-50 opacity-40 grayscale"
                          : "hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 cursor-pointer"
                      }`}
                      onClick={() => !isSelected && addProduct(product)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-300">
                          <Tag size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">
                            {product.name}
                          </p>
                          <p className="text-indigo-600 font-bold text-xs mt-1">
                            {Number(product.price_buy).toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                          isSelected
                            ? "text-slate-300 italic"
                            : "bg-white text-indigo-600 shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {isSelected ? "Đã nằm trong list" : "CHỌN"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
