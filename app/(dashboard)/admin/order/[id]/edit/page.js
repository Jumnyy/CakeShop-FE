"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "@/services/OrderService";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Truck,
  Save,
  Loader2,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    status: 0,
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await OrderService.getById(id);
        const order = res.data.data ?? res.data;

        setForm({
          name: order.name ?? "",
          phone: order.phone ?? "",
          address: order.address ?? "",
          note: order.note ?? "",
          status: order.status ?? 0,
        });
      } catch (err) {
        alert("❌ Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await OrderService.update(id, form);
      alert("✅ Cập nhật đơn hàng thành công");
      router.push("/admin/order");
    } catch (err) {
      alert("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (Number(status)) {
      case 0:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 1:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 2:
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case 3:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 4:
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold animate-pulse italic">
          Đang truy xuất hồ sơ đơn hàng...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Chi tiết Đơn hàng
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Mã vận đơn: #{id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/order")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition font-black text-xs uppercase"
          >
            <ArrowLeft size={16} /> Thoát
          </button>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
            {/* Section: Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <User size={18} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Thông tin người nhận
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                    Họ tên
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                  Địa chỉ giao hàng
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-5 text-slate-300"
                    size={16}
                  />
                  <textarea
                    name="address"
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-600"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-50" />

            {/* Section: Operational */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Truck size={18} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Vận hành & Trạng thái
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-1 italic text-indigo-500">
                  Tiến độ xử lý
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full appearance-none border-2 rounded-2xl p-4 outline-none font-black transition-all ${getStatusColor(
                      form.status
                    )}`}
                  >
                    <option value={0}>⏳ Đang chờ duyệt hệ thống</option>
                    <option value={1}>✅ Xác nhận đơn hàng thành công</option>
                    <option value={2}>🚚 Đã bàn giao đơn vị vận chuyển</option>
                    <option value={3}>🎉 Giao hàng hoàn tất</option>
                    <option value={4}>❌ Đơn hàng đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
                  Ghi chú nội bộ
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-4 text-slate-300"
                    size={16}
                  />
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Ghi chú thêm về yêu cầu khách hàng..."
                    value={form.note}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium italic"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                XÁC NHẬN CẬP NHẬT
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
