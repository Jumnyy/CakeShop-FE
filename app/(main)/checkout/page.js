"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Truck, ChevronLeft, ShieldCheck, 
  MapPin, Phone, Mail, User, NotebookPen, ArrowRight 
} from 'lucide-react'; 
import OrderService from '../../../services/OrderService';
import cartService from '../../../services/CartService';

const Checkout = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [formData, setFormData] = useState({
        user_id: 1, name: '', email: '', phone: '', address: '', note: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingCart, setFetchingCart] = useState(true);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const data = await cartService.getCart();
                if (data?.items?.length > 0) {
                    setCartItems(data.items);
                } else {
                    router.push('/');
                }
            } catch (error) {
                router.push('/cart');
            } finally {
                setFetchingCart(false);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    user_id: user.id || 1,
                    name: user.name || '', email: user.email || '', 
                    phone: user.phone || '', address: user.address || ''
                }));
            } catch (e) { }
        }
        fetchCartData();
    }, [router]);

    const getEffectivePrice = (item) => {
        const originalPrice = Number(item.product?.price_buy || 0);
        const salePrice = Number(item.product?.sale_price || 0);
        return (salePrice > 0 && salePrice < originalPrice) ? salePrice : (originalPrice || Number(item.price || 0));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (getEffectivePrice(item) * item.quantity), 0);
    const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...formData,
            status: 1,
            payment_method: paymentMethod,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                price: getEffectivePrice(item),
                qty: item.quantity,
                discount: 0
            }))
        };

        try {
            const response = await OrderService.create(payload);
            if (response?.status) {
                if (paymentMethod === 'vnpay' && response.payment_url) {
                    window.location.href = response.payment_url;
                } else {
                    await cartService.clearCart();
                    router.push('/thank-you');
                }
            }
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCart) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-xs uppercase tracking-[0.2em]">Authenticating...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 pb-20">
            {/* Header Đẳng Cấp */}
            <div className="bg-white border-b border-zinc-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-sm uppercase tracking-tighter">
                        <ChevronLeft size={18} /> Quay lại
                    </button>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        <span className="font-black text-xs uppercase tracking-[0.2em]">Secure Checkout</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Cột Trái: Thông tin */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center font-black">1</div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase">Thông tin giao hàng</h2>
                            </div>
                            
                            <form id="checkoutForm" onSubmit={handleCheckout} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input type="text" name="name" required placeholder="Họ và tên khách hàng" className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 focus:border-zinc-900 outline-none transition-all font-bold" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input type="email" name="email" required placeholder="Email liên lạc" className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 focus:border-zinc-900 outline-none transition-all font-bold" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input type="text" name="phone" required placeholder="Số điện thoại" className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 focus:border-zinc-900 outline-none transition-all font-bold" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2 relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input type="text" name="address" required placeholder="Địa chỉ nhận hàng đầy đủ" className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 focus:border-zinc-900 outline-none transition-all font-bold" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2 relative">
                                    <NotebookPen className="absolute left-4 top-4 text-zinc-400" size={18} />
                                    <textarea name="note" placeholder="Lưu ý cho người giao hàng..." className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 h-32 resize-none focus:border-zinc-900 outline-none transition-all font-bold" value={formData.note} onChange={handleInputChange}></textarea>
                                </div>
                            </form>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center font-black">2</div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase">Thanh toán</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div onClick={() => setPaymentMethod('cod')} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-zinc-900 bg-white shadow-xl' : 'border-zinc-100 bg-zinc-50 opacity-60'}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMethod === 'cod' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                        <Truck size={24} />
                                    </div>
                                    <p className="font-black uppercase text-sm tracking-tight">Tiền mặt (COD)</p>
                                    <p className="text-xs text-zinc-500 font-bold mt-1">Giao hàng & thu tiền tận nơi</p>
                                </div>

                                <div onClick={() => setPaymentMethod('vnpay')} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'vnpay' ? 'border-blue-600 bg-white shadow-xl' : 'border-zinc-100 bg-zinc-50 opacity-60'}`}>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-4 p-2">
                                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPAY" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="font-black uppercase text-sm tracking-tight">Thanh toán VNPAY</p>
                                    <p className="text-xs text-zinc-500 font-bold mt-1">ATM / QR / Ví điện tử</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Cột Phải: Tóm tắt */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[3rem] p-8 border border-zinc-100 shadow-2xl shadow-zinc-200/50 sticky top-28">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-8 pb-4 border-b border-zinc-50">Tóm tắt đơn hàng</h2>
                            
                            <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                {cartItems.map((item, index) => {
                                    const price = getEffectivePrice(item);
                                    return (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="relative w-20 h-20 bg-zinc-50 rounded-[0.5rem] overflow-hidden flex-shrink-0 border border-zinc-100">
                                                <img src={item.product?.thumbnail_url || "/placeholder.png"} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-black">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-black uppercase tracking-tight text-zinc-500 line-clamp-1">{item.product?.name}</h3>
                                                <p className="text-sm font-black mt-1">{(price * item.quantity).toLocaleString("vi-VN")}₫</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-100">
                                <div className="flex justify-between text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                    <span>Tạm tính</span>
                                    <span className="text-zinc-900">{subtotal.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                    <span>Vận chuyển</span>
                                    <span className="text-emerald-500">{shippingFee === 0 ? "FREE" : `${shippingFee.toLocaleString("vi-VN")}₫`}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black tracking-tighter leading-none">{totalAmount.toLocaleString("vi-VN")}₫</p>
                                        <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">Đã bao gồm thuế VAT</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit" form="checkoutForm" disabled={loading}
                                className={`w-full mt-10 py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all duration-500 group ${
                                    loading ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-2xl hover:shadow-zinc-900/20'
                                }`}
                            >
                                <span className="font-black uppercase tracking-[0.2em] text-sm">
                                    {loading ? 'Processing...' : (paymentMethod === 'vnpay' ? 'Pay with VNPAY' : 'Complete Order')}
                                </span>
                                {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;