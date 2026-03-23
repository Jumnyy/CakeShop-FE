"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  ShoppingBag,
  XCircle,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import cartService from "@/services/CartService";
import ProductService from "@/services/ProductService"; // Import thêm ProductService
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]); // Lưu danh sách sản phẩm đang sale
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  const fetchCartAndSale = async () => {
    try {
      setLoading(true);
      // Chạy song song lấy giỏ hàng và lấy danh sách sale
      const [cartData, saleRes] = await Promise.all([
        cartService.getCart(),
        ProductService.getSale(),
      ]);

      setCartItems(cartData?.items || []);

      if (saleRes.status && saleRes.data?.items) {
        setSaleItems(saleRes.data.items);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndSale();
  }, []);

  // Hàm helper để lấy giá đúng (giá sale hoặc giá gốc)
  const getItemPrice = (item) => {
    const saleMatch = saleItems.find(
      (s) => Number(s.product_id) === Number(item.product_id)
    );
    // Nếu tìm thấy trong danh sách sale, dùng giá sale, ngược lại dùng giá lưu trong item (hoặc giá gốc từ product)
    return saleMatch ? Number(saleMatch.price_sale) : Number(item.price);
  };

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const updatedCart = await cartService.updateCart(productId, newQty);
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Không thể cập nhật số lượng.");
    }
  };

  const removeItem = async (productId) => {
    if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Không thể xóa sản phẩm.");
    }
  };

  const clearAllCart = async () => {
    if (!confirm("Xóa toàn bộ giỏ hàng?")) return;
    try {
      const updatedCart = await cartService.clearCart();
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      alert("Lỗi thao tác.");
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin?redirect=/cart");
      return;
    }
    router.push("/checkout");
  };

  // TÍNH TOÁN TỔNG TIỀN DỰA TRÊN GIÁ SALE MỚI NHẤT
  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee - discount;

  const formatCurrency = (n) => (n || 0).toLocaleString("vi-VN") + "₫";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-light tracking-widest uppercase">
          Đang cập nhật giỏ hàng...
        </p>
      </div>
    );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              href="/products"
              className="flex items-center text-zinc-400 hover:text-black transition-colors mb-4 text-xs uppercase tracking-widest group"
            >
              <ChevronLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform mr-1"
              />
              Tiếp tục mua sắm
            </Link>
            <h1 className="text-4xl font-light uppercase tracking-tighter text-zinc-900">
              Giỏ hàng{" "}
              <span className="text-zinc-300 ml-2">[{cartItems.length}]</span>
            </h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearAllCart}
              className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-2 border-b border-transparent hover:border-red-600 pb-1"
            >
              <Trash2 size={12} /> Làm trống giỏ hàng
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-sm border border-zinc-100">
            <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-6" />
            <p className="uppercase tracking-[0.2em] text-zinc-400 text-sm">
              Chưa có sản phẩm nào
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* List Items */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const currentPrice = getItemPrice(item);
                  const isSale = currentPrice < item.price;

                  return (
                    <div
                      key={item.product_id}
                      className="group bg-white p-6 border border-zinc-100 hover:border-zinc-300 transition-all shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="w-full md:w-32 aspect-[3/4] bg-zinc-50 overflow-hidden shrink-0 relative">
                          <img
                            src={
                              item.product?.thumbnail_url || "/placeholder.png"
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {isSale && (
                            <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
                              Flash Sale
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium uppercase tracking-tight text-zinc-900 mb-1">
                                {item.product?.name}
                              </h3>
                              <p className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Tag size={10} /> Phân loại: Mặc định
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="text-zinc-300 hover:text-red-600 transition-colors"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                            {/* Quantity Control */}
                            <div className="flex items-center border border-zinc-200 rounded-sm">
                              <button
                                onClick={() =>
                                  updateQty(item.product_id, item.quantity - 1)
                                }
                                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-sm font-bold border-x border-zinc-200 leading-10">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(item.product_id, item.quantity + 1)
                                }
                                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50"
                              >
                                +
                              </button>
                            </div>

                            {/* Price Display */}
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {isSale && (
                                  <span className="text-xs text-zinc-400 line-through font-light">
                                    {formatCurrency(item.price)}
                                  </span>
                                )}
                                <span
                                  className={`text-xl font-bold ${
                                    isSale ? "text-red-600" : "text-zinc-900"
                                  }`}
                                >
                                  {formatCurrency(currentPrice)}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">
                                Tổng:{" "}
                                {formatCurrency(currentPrice * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 border border-zinc-100 shadow-sm sticky top-28">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 pb-4 border-b border-zinc-900">
                  Tổng đơn hàng
                </h2>

                <div className="space-y-4 mb-10 text-sm">
                  <div className="flex justify-between text-zinc-500 uppercase tracking-widest text-[11px]">
                    <span>Tạm tính</span>
                    <span className="text-zinc-900 font-bold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500 uppercase tracking-widest text-[11px]">
                    <span>Phí vận chuyển</span>
                    <span
                      className={
                        shippingFee === 0
                          ? "text-green-600 font-bold"
                          : "text-zinc-900 font-bold"
                      }
                    >
                      {shippingFee === 0
                        ? "MIỄN PHÍ"
                        : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[9px] text-zinc-400 italic font-light">
                      * Miễn phí vận chuyển cho đơn hàng từ 2.000.000₫
                    </p>
                  )}
                  <div className="pt-6 border-t border-zinc-100 flex justify-between items-baseline">
                    <span className="text-xs font-black uppercase tracking-widest">
                      Tổng cộng
                    </span>
                    <span className="text-3xl font-bold tracking-tighter text-zinc-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group"
                >
                  Tiến hành thanh toán{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-zinc-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-zinc-900" />
                  Bảo mật thanh toán 100%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
