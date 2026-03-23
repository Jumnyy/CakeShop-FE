"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "@/services/OrderService";
import {
  Package,
  MapPin,
  CreditCard,
  ChevronLeft,
  Tag,
  Truck,
  Phone,
  User,
} from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // Backend cần trả về: Order::with(['details.product'])->find($id)
        const res = await OrderService.getById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!order)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Không tìm thấy đơn hàng!
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* HEADER CỐ ĐỊNH */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Chi tiết đơn # {order.id}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {/* THÔNG TIN NGƯỜI NHẬN & VẬN CHUYỂN */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-xs uppercase mb-2 tracking-wider">
                Địa chỉ nhận hàng
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <User size={14} className="text-slate-400" /> {order.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Phone size={14} className="text-slate-400" /> {order.phone}
                </div>
                <p className="text-sm text-slate-500 italic mt-2 leading-relaxed">
                  {order.address}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-xs uppercase mb-1 tracking-wider">
                Phương thức thanh toán
              </h3>
              <p className="text-sm font-bold text-indigo-600 uppercase">
                {order.payment_method === "vnpay"
                  ? "💳 Ví điện tử VNPay"
                  : "🚚 Tiền mặt (COD)"}
              </p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH SẢN PHẨM (Map từ details) */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-[2px] flex items-center gap-2">
              <Package size={16} className="text-indigo-600" /> Danh sách sản
              phẩm
            </h3>
          </div>

          <div className="divide-y divide-slate-50">
            {order.details?.map((item) => (
              <div
                key={item.id}
                className="p-6 flex gap-4 group hover:bg-slate-50/50 transition-all"
              >
                {/* HÌNH ẢNH SẢN PHẨM */}
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-200">
                  {item.product?.image ? (
                    <img
                      src={item.product.thumbnail_url}
                      alt={item.product.name}
                      className={`w-full h-full object-cover transition-transform duration-[1.5s] ${
                        item.isOutOfStock
                          ? "grayscale opacity-40"
                          : "group-hover:scale-110"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package size={32} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm leading-tight truncate-2-lines group-hover:text-indigo-600 transition-colors">
                    {item.product?.name || `Sản phẩm ID: ${item.product_id}`}
                  </h4>

                  <div className="mt-3 flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        Đơn giá: {Number(item.price).toLocaleString()}đ
                      </p>
                      <p className="text-xs font-black text-slate-700">
                        Số lượng:{" "}
                        <span className="text-indigo-600">x{item.qty}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        {Number(item.amount).toLocaleString()}đ
                      </p>
                      {item.discount > 0 && (
                        <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-0.5 justify-end">
                          <Tag size={10} /> -
                          {Number(item.discount).toLocaleString()}đ
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT HÓA ĐƠN */}
          <div className="p-8 bg-slate-900 text-white space-y-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-[1px]">
              <span>Tổng tiền hàng</span>
              <span>
                {Number(
                  order.total_amount || order.amount || 0
                ).toLocaleString()}
                đ
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-[1px]">
              <span>Phí vận chuyển</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-sm font-black uppercase tracking-[2px]">
                Tổng thanh toán
              </span>
              <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                {Number(
                  order.total_amount || order.amount || 0
                ).toLocaleString()}
                <span className="text-sm ml-1 italic">đ</span>
              </span>
            </div>
          </div>
        </div>

        {/* GHI CHÚ */}
        {order.note && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-xs font-black text-amber-700 uppercase mb-1 italic">
              Ghi chú đơn hàng:
            </p>
            <p className="text-sm text-amber-800">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
