"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderService from "@/services/OrderService";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
  ChevronRight,
  ArrowLeft,
  Search,
  Receipt,
  CreditCard,
} from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  // FIX 1: Thêm state để kiểm tra component đã mounted ở phía client chưa
  const [mounted, setMounted] = useState(false);

  const STATUS_MAP = {
    0: { label: "Chờ duyệt", color: "bg-amber-500", icon: <Clock size={14} /> },
    1: {
      label: "Đã xác nhận",
      color: "bg-blue-500",
      icon: <CheckCircle2 size={14} />,
    },
    2: {
      label: "Đang giao",
      color: "bg-indigo-500",
      icon: <Truck size={14} />,
    },
    3: {
      label: "Hoàn tất",
      color: "bg-emerald-500",
      icon: <Package size={14} />,
    },
    4: { label: "Đã hủy", color: "bg-rose-500", icon: <XCircle size={14} /> },
  };

  useEffect(() => {
    // FIX 2: Đánh dấu component đã mounted
    setMounted(true);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await OrderService.getList({ limit: 50 });
        const data = res.data?.data || res.data || [];
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // FIX 3: Ngăn chặn Hydration Mismatch bằng cách không render nội dung cho đến khi client-side sẵn sàng
  if (!mounted) return null;

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => String(o.status) === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-bold tracking-tight">
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER */}
      <div className="bg-white px-4 py-5 sticky top-0 z-20 shadow-sm border-b border-slate-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-xl font-black text-slate-900 tracking-tight text-nowrap">
              Đơn mua của tôi
            </h1>
          </div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Search size={22} />
          </button>
        </div>

        {/* TABS */}
        <div className="max-w-2xl mx-auto mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["all", "0", "1", "2", "3", "4"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab === "all" ? "Tất cả" : STATUS_MAP[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Receipt size={48} />
            </div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
              Trống rỗng
            </p>
            <Link
              href="/"
              className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group"
            >
              {/* Lưu ý: Dùng Link bọc nội dung, không bọc Link trong Link */}
              <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white rounded-lg text-slate-900 font-black text-[10px] border border-slate-100 shadow-sm">
                    #{order.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("vi-VN")
                      : "---"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase shadow-sm ${
                    STATUS_MAP[order.status]?.color || "bg-slate-400"
                  }`}
                >
                  {STATUS_MAP[order.status]?.icon}
                  {STATUS_MAP[order.status]?.label}
                </div>
              </div>

              <div className="p-6 flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-50 rounded-[22px] flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                  <ShoppingBag size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 truncate text-sm uppercase tracking-tight">
                    {order.name || "Khách hàng"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium italic truncate">
                    {order.address}
                  </p>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all group-hover:bg-indigo-600 group-hover:text-white"
                >
                  Chi tiết <ChevronRight size={14} />
                </Link>
              </div>

              <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <CreditCard size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {order.payment_method === "vnpay"
                      ? "Ví VNPay"
                      : "Tiền mặt (COD)"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">
                    Tổng thanh toán
                  </p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">
                    {Number(
                      order.total_amount || order.amount || 0
                    ).toLocaleString()}
                    <span className="text-sm ml-0.5 font-bold italic text-indigo-600">
                      đ
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
