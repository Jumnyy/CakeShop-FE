"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Home,
  ShoppingBag,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import cartService from "../../../services/CartService";
import httpAxios from "../../../services/httpAxios";

const ThankYouContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const checkPayment = async () => {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

      if (!vnp_ResponseCode) {
        setStatus("success");
        return;
      }

      try {
        const queryStr = searchParams.toString();
        const res = await httpAxios.get(`vnpay-return?${queryStr}`);

        if (res && res.status) {
          setStatus("success");
          await cartService.clearCart();
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.warn("Lỗi kết nối:", error);
        setStatus("failed");
      }
    };

    checkPayment();
  }, [searchParams]);

  // 1. TRẠNG THÁI ĐANG KIỂM TRA
  if (status === "checking") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
          <ShoppingBag className="absolute text-zinc-900" size={24} />
        </div>
        <h2 className="mt-6 text-xl font-bold text-zinc-900 animate-pulse">
          Đang xác thực giao dịch...
        </h2>
        <p className="text-zinc-500 mt-2">
          Vui lòng không đóng trình duyệt lúc này.
        </p>
      </div>
    );
  }

  // 2. TRẠNG THÁI THẤT BẠI
  if (status === "failed") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-red-50 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">
            Thanh toán thất bại
          </h1>
          <p className="text-zinc-500 mb-10 leading-relaxed">
            Đã có lỗi xảy ra trong quá trình xử lý thanh toán hoặc giao dịch đã
            bị hủy. Đừng lo lắng, bạn có thể thử lại ngay.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              <RefreshCcw size={18} />
              Thanh toán lại
            </Link>
            <Link
              href="/"
              className="w-full bg-zinc-100 text-zinc-600 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. TRẠNG THÁI THÀNH CÔNG
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animation Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
          THANK YOU!
        </h1>
        <p className="text-lg text-zinc-500 mb-2 font-medium">
          Đơn hàng của bạn đã được đặt thành công.
        </p>
        <p className="text-zinc-400 mb-12 max-w-sm mx-auto">
          Chúng tôi sẽ sớm liên hệ với bạn để xác nhận thông tin vận chuyển.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link
            href="/"
            className="group bg-zinc-900 text-white p-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            <Home
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
            Tiếp tục mua sắm
          </Link>

          <Link
            href="/order-history"
            className="group bg-white text-zinc-900 p-5 rounded-3xl font-bold border border-zinc-200 flex items-center justify-center gap-3 hover:border-zinc-900 transition-all"
          >
            Xem đơn hàng
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Phụ đề nhỏ */}
        <p className="mt-12 text-xs text-zinc-400 uppercase tracking-[0.2em] font-bold">
          Thủ tục bảo mật bởi Store Cloud
        </p>
      </div>
    </div>
  );
};

const ThankYouPage = () => (
  <div className="bg-[#fafafa] min-h-screen">
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  </div>
);

export default ThankYouPage;
