"use client";

import { useEffect, useState, useMemo } from "react";
import ProductService from "@/services/ProductService";
import CategoryService from "@/services/CategoryService";
import PostService from "@/services/PostService";
import BannerService from "@/services/BannerService";
import Link from "next/link";
import { Clock, ShoppingBag, ArrowRight, Sparkles, ChevronRight } from "lucide-react";

const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "Liên hệ";
  return num.toLocaleString("vi-VN") + " ₫";
};

export default function Home() {
  const [data, setData] = useState({
    banners: [], productsNew: [], allProducts: [], categories: [], sale: null, post: null
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, postRes, newRes, saleRes, catRes, prodRes] = await Promise.all([
          BannerService.getList({ status: 1, position: "slideshow" }),
          PostService.getList({ limit: 1, sort: "new" }),
          ProductService.getNew(),
          ProductService.getSale(),
          CategoryService.getList(),
          ProductService.getList({ limit: 50 }),
        ]);

        setData({
          banners: bannerRes?.data?.data || bannerRes?.data || [],
          post: (postRes?.data?.data || postRes?.data || [])[0],
          productsNew: newRes?.data?.data || newRes?.data || [],
          categories: catRes?.data?.data || catRes?.data || [],
          allProducts: prodRes?.data?.data || prodRes?.data || [],
          sale: saleRes.status ? saleRes.data : null,
        });
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return data.allProducts.slice(0, 10);
    return data.allProducts.filter((p) => String(p.category_id) === String(selectedCategory));
  }, [selectedCategory, data.allProducts]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-zinc-400">Fresh Garden</p>
      </div>
    </div>
  );

  return (
    <section className="bg-white text-[#1a1a1a] font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* 1. HERO BANNER - Nâng cấp hiệu ứng Reveal */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        {data.banners.length > 0 && (
          <div className="w-full h-full">
            <img
              src={data.banners[0].image_url}
              alt="Banner"
              className="w-full h-full object-cover animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <span className="block text-[11px] tracking-[0.6em] uppercase mb-6 animate-fade-in-down opacity-80">Authentic Bakery</span>
            <h1 className="text-6xl md:text-[8rem] font-extralight tracking-tighter uppercase mb-10 leading-none">
              Fresh <span className="font-serif italic font-light tracking-normal block md:inline">Garden</span>
            </h1>
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-6 border border-white/50 px-12 py-5 uppercase text-[10px] font-bold tracking-[0.3em] overflow-hidden transition-all hover:border-white rounded-full"
            >
              <span className="relative z-10">Khám phá bộ sưu tập</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <ArrowRight size={16} className="relative z-10 group-hover:text-black transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FLASH SALE - Giao diện Card hiện đại hơn */}
      {data.sale && (
        <div className="bg-[#fffafa] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 text-red-600 mb-4">
                  <Clock size={18} className="animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black">Ưu đãi giới hạn</span>
                </div>
                <h2 className="text-4xl font-extralight uppercase tracking-widest">{data.sale.name}</h2>
              </div>
              <Link href="/sale" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all">Xem tất cả</Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {data.sale.items.slice(0, 5).map((item) => (
                <Link key={item.id} href={`/products/${item.product.id}`} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-white shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <img
                      src={`http://localhost:8000/storage/${item.product.thumbnail}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={item.product.name}
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                      -{Math.round(((item.product.price_buy - item.price_sale) / item.product.price_buy) * 100)}%
                    </div>
                  </div>
                  <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2 group-hover:text-red-600 transition-colors">{item.product.name}</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-red-600 font-bold text-base">{formatPrice(item.price_sale)}</span>
                    <span className="text-zinc-400 text-[11px] line-through">{formatPrice(item.product.price_buy)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. LỌC DANH MỤC - Hiệu ứng chuyển mục mượt mà */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col items-center mb-20">
          <span className="text-amber-700 text-[10px] font-black tracking-[0.5em] uppercase mb-4">Our Selection</span>
          <h2 className="text-5xl font-extralight uppercase tracking-[0.1em] mb-12">Thực đơn nghệ nhân</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar max-w-full justify-start md:justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-10 py-4 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500 border ${
                selectedCategory === "all" ? "bg-zinc-900 text-white border-zinc-900 shadow-xl scale-105" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
              }`}
            >
              Tất cả
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-10 py-4 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500 border whitespace-nowrap ${
                  String(selectedCategory) === String(cat.id) ? "bg-zinc-900 text-white border-zinc-900 shadow-xl scale-105" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, idx) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group animate-fade-in-up" style={{animationDelay: `${idx * 80}ms`, animationFillMode: 'forwards'}}>
                <div className="relative aspect-[3/4] bg-zinc-50 rounded-[2.5rem] overflow-hidden mb-6 transition-all duration-700 group-hover:rounded-2xl group-hover:shadow-2xl">
                  <img
                    src={`http://localhost:8000/storage/${p.thumbnail}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={p.name}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all"></div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 w-[80%]">
                    <div className="bg-white/90 backdrop-blur-md text-black text-[9px] font-black py-3 rounded-full shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest">
                      <ShoppingBag size={12} /> Chi tiết
                    </div>
                  </div>
                </div>
                <div className="text-center px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-amber-800 transition-colors">{p.name}</h3>
                  <p className="text-sm font-light text-zinc-400 tracking-tighter">{formatPrice(p.price_sale ?? p.price_buy)}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-zinc-300 uppercase tracking-[0.3em] text-[10px] font-bold">Chưa có sản phẩm trong mục này</div>
          )}
        </div>
      </div>

      {/* 4. STORY SECTION - Thiết kế bất đối xứng (Luxury Style) */}
      {data.post && (
        <div className="bg-zinc-900 py-40 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 border border-white/10 rounded-[4rem] group-hover:inset-0 transition-all duration-[1.5s]"></div>
              <div className="relative rounded-[3.5rem] overflow-hidden h-[650px] shadow-2xl">
                <img src="/images/post.jpg" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" alt="Story" />
              </div>
            </div>
            <div className="space-y-10">
              <div className="flex items-center gap-4 text-amber-500">
                <Sparkles size={20} />
                <span className="text-[10px] font-black tracking-[0.5em] uppercase">The Art of Garden</span>
              </div>
              <h2 className="text-6xl font-extralight tracking-tighter leading-[0.9] italic uppercase">{data.post.title}</h2>
              <p className="text-zinc-400 font-light text-lg leading-loose italic">"{data.post.content}"</p>
              <Link href={`/post/${data.post.id}`} className="group inline-flex items-center gap-6">
                <span className="text-[11px] font-black tracking-[0.4em] uppercase">Khám phá câu chuyện</span>
                <div className="w-16 h-[1px] bg-white/30 group-hover:w-24 group-hover:bg-amber-500 transition-all duration-700"></div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. NEW ARRIVALS - Circle Design */}
      <div className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-24">
          <h2 className="text-[11px] font-black tracking-[0.8em] uppercase text-zinc-300 mb-4">Daily Fresh</h2>
          <h3 className="text-4xl font-serif italic text-zinc-800">Mới ra lò hôm nay</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {data.productsNew.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group text-center">
              <div className="aspect-square rounded-full overflow-hidden mb-8 border border-zinc-100 p-3 group-hover:border-zinc-900 transition-all duration-700">
                <img src={`http://localhost:8000/storage/${p.thumbnail}`} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-[1s]" alt={p.name} />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">{p.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes slow-zoom { 
          from { transform: scale(1); } 
          to { transform: scale(1.1); } 
        }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { opacity: 0; animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 1.2s ease-out forwards; }
      `}</style>
    </section>
  );
}