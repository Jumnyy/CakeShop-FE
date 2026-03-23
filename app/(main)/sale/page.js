"use client";
import { useEffect, useState } from "react";
import ProductService from "@/services/ProductService";
import Link from "next/link";
import { Clock } from "lucide-react";

const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "Liên hệ";
  return num.toLocaleString("vi-VN") + " ₫";
};

// --- Component Countdown riêng biệt cho sạch code ---
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const distance = target - now;
      if (distance < 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired)
    return (
      <span className="text-[10px] tracking-widest text-gray-400 uppercase">
        Chương trình đã kết thúc
      </span>
    );

  return (
    <div className="flex items-center gap-3 font-mono text-sm tracking-widest text-gray-800">
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg leading-none">{timeLeft.days}</span>
        <span className="text-[8px] uppercase text-gray-400">Ngày</span>
      </div>
      <span className="text-gray-300 mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg leading-none">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-[8px] uppercase text-gray-400">Giờ</span>
      </div>
      <span className="text-gray-300 mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg leading-none">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-[8px] uppercase text-gray-400">Phút</span>
      </div>
      <span className="text-gray-300 mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg leading-none text-red-600 animate-pulse">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-[8px] uppercase text-red-400 font-bold">
          Giây
        </span>
      </div>
    </div>
  );
};

export default function SaleBanner() {
  const [sale, setSale] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await ProductService.getSale();
        if (res.status && res.data) {
          setSale(res.data);
        } else {
          setMessage(res.message || "Hiện chưa có chương trình khuyến mãi");
        }
      } catch (error) {
        setMessage("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-white py-24 border-t border-gray-50">
      <div className="max-w-7x2 mx-auto px-6">
        {sale ? (
          <div>
            {/* --- HEADER CHƯƠNG TRÌNH --- */}
            <div className="flex flex-col items-center mb-16 text-center">
              <span className="text-[20px] uppercase tracking-[0.5em] text-red-600 font-bold mb-2 animate-pulse">
                Flash Sale Limited
              </span>
              <h2 className="text-4xl md:text-5xl font-extralight uppercase tracking-[0.2em] mb-2 text-[#1a1a1a]">
                {sale.name}
              </h2>

              {/* Thanh đếm ngược trung tâm */}
              <div className="flex flex-col items-center bg-gray-50 px-10 py-8 rounded-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Clock size={12} strokeWidth={1.5} />
                  <span className="text-[9px] uppercase tracking-[0.2em]">
                    Thời gian còn lại
                  </span>
                </div>
                <CountdownTimer endDate={sale.date_end} />
              </div>
            </div>

            {/* --- GRID SẢN PHẨM --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {sale.items.map((item) => {
                const discount = Math.round(
                  ((item.product.price_buy - item.price_sale) /
                    item.product.price_buy) *
                    100
                );

                return (
                  <div key={item.id} className="group relative">
                    {/* Hình ảnh (tỉ lệ 3/4 sang trọng) */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f9f9f9] mb-6 rounded-sm shadow-sm">
                      <Link href={`/products/${item.product.id}`}>
                        <img
                          src={`http://localhost:8000/storage/${item.product.thumbnail}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </Link>

                      {/* Badge giảm giá */}
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] px-3 py-1 uppercase font-bold tracking-widest shadow-lg">
                        -{discount}%
                      </div>

                      {/* Nút "Mua ngay" trượt lên khi hover */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="w-full bg-white/90 backdrop-blur-md py-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                            Khám phá ngay
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="text-center px-2">
                      <h3 className="text-[13px] uppercase tracking-wider font-semibold mb-2 group-hover:text-red-700 transition-colors line-clamp-1 italic">
                        {item.product.name}
                      </h3>

                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-bold tracking-widest text-red-600">
                          {formatPrice(item.price_sale)}
                        </p>
                        {item.product.price_buy > item.price_sale && (
                          <p className="text-[11px] font-light tracking-widest text-gray-400 line-through">
                            {formatPrice(item.product.price_buy)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <p className="text-[11px] uppercase tracking-[0.4em] italic text-gray-500">
              {message || "Hiện chưa có chương trình khuyến mãi nào đặc biệt."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
