"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ProductService from "@/services/ProductService";
import ProductSaleService from "@/services/ProductSaleService";
import Link from "next/link";
import {
  X,
  Clock,
  Tag,
  Search,
  Trash2,
  CalendarClock,
  Gift,
  ChevronLeft,
  Save,
  Loader2,
  PackageSearch,
  AlertCircle,
} from "lucide-react";
import { Plus } from "lucide-react";
export default function EditProductSale({ params }) {
  const router = useRouter();
  const { id } = use(params);

  // States
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [resProducts, resDetail] = await Promise.all([
          ProductService.getList({ limit: 9999, status: 1 }),
          ProductSaleService.getById(id),
        ]);

        setProducts(resProducts.data || []);

        if (resDetail && (resDetail.status === true || resDetail.data)) {
          const sale = resDetail.data;
          setName(sale.name || "");
          if (sale.date_begin)
            setDateBegin(sale.date_begin.replace(" ", "T").substring(0, 16));
          if (sale.date_end)
            setDateEnd(sale.date_end.replace(" ", "T").substring(0, 16));

          const mappedItems = (sale.products || []).map((p) => ({
            product_id: p.product_id,
            name: p.product_name || p.name || "Sản phẩm không xác định",
            sku: p.product_sku || p.sku || "N/A",
            price_original: Number(p.price_original || p.price_buy || 0),
            price_sale: Number(p.price_sale || 0),
          }));
          setSelectedItems(mappedItems);
        }
      } catch (e) {
        console.error("Lỗi load dữ liệu:", e);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const applyDiscountAll = () => {
    const updated = selectedItems.map((item) => {
      const price = Number(item.price_original);
      let price_sale =
        discountType === "percent"
          ? price - (price * Number(discountValue)) / 100
          : price - Number(discountValue);
      return { ...item, price_sale: Math.round(Math.max(0, price_sale)) };
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

  const removeItem = (id) =>
    setSelectedItems(selectedItems.filter((i) => i.product_id !== id));

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
    if (!name || !dateBegin || !dateEnd || selectedItems.length === 0)
      return alert("Vui lòng nhập đầy đủ thông tin!");
    setLoading(true);
    try {
      const payload = {
        name,
        date_begin: dateBegin.replace("T", " ") + ":00",
        date_end: dateEnd.replace("T", " ") + ":00",
        products: selectedItems.map((item) => ({
          product_id: Number(item.product_id),
          price_sale: Number(item.price_sale),
          qty: 1,
        })),
      };
      const res = await ProductSaleService.update(id, payload);
      if (res && (res.status === true || res.data?.status === true))
        router.push("/admin/productsale");
    } catch (error) {
      alert("Thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">
          Đang truy xuất dữ liệu chiến dịch...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/productsale"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Danh sách khuyến mãi
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Sửa chiến dịch: <span className="text-indigo-600">{name}</span>
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Cập nhật thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: CONFIG */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> Cài đặt thời gian
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Tên chương trình
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
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
            </div>
          </section>
        </div>

        {/* RIGHT: PRODUCTS */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Gift size={16} className="text-indigo-500" /> Sản phẩm áp dụng
              </h2>
              <button
                onClick={() => setShowPopup(true)}
                className="text-indigo-600 font-black text-xs bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-1"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {/* QUICK TOOLBAR */}
            <div className="p-6 bg-white border-b border-slate-100 flex flex-wrap items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setDiscountType("percent")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    discountType === "percent"
                      ? "bg-white shadow text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  % Giảm
                </button>
                <button
                  onClick={() => setDiscountType("amount")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    discountType === "amount"
                      ? "bg-white shadow text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  đ Tiền mặt
                </button>
              </div>
              <input
                type="number"
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-indigo-600"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
              <button
                onClick={applyDiscountAll}
                className="text-xs font-black text-white bg-slate-800 px-4 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-md"
              >
                Áp dụng tất cả dòng
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                    <th className="px-6 py-4 text-left">Sản phẩm</th>
                    <th className="px-6 py-4 text-right">Giá gốc</th>
                    <th className="px-6 py-4 text-right">Giá KM hiện tại</th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedItems.map((item) => (
                    <tr
                      key={item.product_id}
                      className="group hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            SKU: {item.sku}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 font-bold text-sm">
                        {item.price_original.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <input
                            type="number"
                            className={`w-36 text-right font-black p-2.5 rounded-xl border outline-none ${
                              item.price_sale > item.price_original
                                ? "border-red-400 bg-red-50 text-red-600"
                                : "border-slate-200 focus:border-emerald-500 text-emerald-600"
                            }`}
                            value={item.price_sale}
                            onChange={(e) =>
                              updateItemPrice(item.product_id, e.target.value)
                            }
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedItems.length > 0 && (
              <div className="p-8 bg-slate-900 border-t border-slate-800 text-right">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[3px]">
                  Tổng ngân sách ưu đãi
                </span>
                <div className="text-white text-3xl font-black tracking-tight">
                  - {totalReduce.toLocaleString()}
                  <span className="text-indigo-400 ml-1 italic text-xl">đ</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* POPUP (MODERN) */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-xl max-h-[80vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">
                Thêm hàng vào chiến dịch
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                          ? "opacity-40 grayscale bg-slate-50"
                          : "hover:bg-indigo-50 cursor-pointer"
                      }`}
                      onClick={() => !isSelected && addProduct(product)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-300">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">
                            {product.name}
                          </p>
                          <p className="text-indigo-600 font-bold text-xs mt-0.5">
                            {Number(product.price_buy).toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-xl text-[10px] font-black ${
                          isSelected
                            ? "text-slate-400"
                            : "bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                        }`}
                      >
                        {isSelected ? "ĐÃ CHỌN" : "CHỌN NGAY"}
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
