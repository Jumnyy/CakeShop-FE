"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "@/services/OrderService";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react"; // Cần cài đặt lucide-react

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderService.getById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!order)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        ❌ Không tìm thấy đơn hàng
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-600 hover:text-slate-900 transition font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
          </button>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition">
              🖨️ In hóa đơn
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md transition">
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Customer Info & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-4 flex items-center">
                <FileText size={16} className="mr-2" /> Thông tin đơn hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-sm">Mã đơn hàng</p>
                  <p className="text-xl font-extrabold text-slate-900">
                    #{order.id}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Trạng thái</p>
                  {order.status === 1 ? (
                    <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                      <CheckCircle2 size={12} className="mr-1" /> Đã duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
                      <Clock size={12} className="mr-1" /> Chờ xử lý
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Thanh toán</p>
                  <p className="text-slate-800 font-semibold flex items-center mt-1">
                    <CreditCard size={16} className="mr-2 text-slate-400" />
                    {order.payment_method?.toUpperCase() || "COD"}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-4 flex items-center">
                <User size={16} className="mr-2" /> Khách hàng
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mr-3">
                    {order.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{order.name}</p>
                    <p className="text-slate-500 text-xs">
                      ID Người dùng: {order.user_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-400" />{" "}
                  {order.email}
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone size={16} className="mr-3 text-slate-400" />{" "}
                  {order.phone}
                </div>
                <div className="flex items-start text-slate-600">
                  <MapPin size={16} className="mr-3 mt-1 text-slate-400" />
                  <span>{order.address}</span>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs italic text-slate-500 border-l-4 border-slate-300">
                  {order.note || "Không có ghi chú nào từ khách hàng."}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Items Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <Package size={18} className="mr-2 text-indigo-600" /> Chi
                  tiết kiện hàng
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border shadow-sm">
                  {order.details?.length || 0} sản phẩm
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest bg-white">
                      <th className="px-6 py-4 text-left font-bold">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-center font-bold">
                        Đơn giá
                      </th>
                      <th className="px-6 py-4 text-center font-bold">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-right font-bold">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  {/* Thay đổi phần render table body */}
                  <tbody>
                    {order.details?.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition border-b"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {/* thumbnail lấy từ bảng products */}
                            <img
                              src={
                                item.product?.thumbnail_url ||
                                "https://placehold.co/50"
                              }
                              alt="thumb"
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                            <div>
                              {/* TRUY CẬP VÀO TÊN SẢN PHẨM QUA ITEM.PRODUCT */}
                              <p className="font-bold text-slate-800">
                                {item.product?.name ||
                                  "Sản phẩm không xác định"}
                              </p>
                              <p className="text-xs text-slate-500">
                                Mã SP: {item.product_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-600">
                          {Number(item.price).toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
                            x{item.qty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          {(item.price * item.qty).toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS SECTION */}
              <div className="p-6 bg-slate-50/30 border-t border-slate-100">
                <div className="space-y-2 max-w-xs ml-auto">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tạm tính:</span>
                    <span>
                      {order.details
                        ?.reduce((t, i) => t + i.price * i.qty, 0)
                        .toLocaleString()}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-500 font-medium">
                      Miễn phí
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-slate-900 font-extrabold">
                      Tổng thanh toán:
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      {order.details
                        ?.reduce((t, i) => t + i.price * i.qty, 0)
                        .toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
