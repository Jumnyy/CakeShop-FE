"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductService from "@/services/ProductService";
import CategoryService from "@/services/CategoryService";
import Link from "next/link";
import { 
  ChevronRight, 
  LayoutGrid, 
  List, 
  ShoppingBag, 
  ChevronDown,
  X 
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm");

  // Filter States
  const currentCategorySlug = searchParams.get("category") || "";
  const currentPriceRange = searchParams.get("price") || "all";
  const currentSort = searchParams.get("sort") || "default";

  const priceRanges = [
    { label: "Tất cả mức giá", value: "all" },
    { label: "Dưới 40.000₫", value: "0-40.000" },
    { label: "30.000₫ - 50.000₫", value: "30.000-50.000" },
    { label: "Trên 50.000₫", value: "50.000-9999999" },
  ];

  // 1. Khởi tạo Categories & Sale
  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, saleRes] = await Promise.all([
          CategoryService.getList({ limit: 999 }),
          ProductService.getSale(),
        ]);
        const allCats = catRes.data || [];
        const tree = allCats
          .filter((cat) => !cat.parent_id)
          .map((parent) => ({
            ...parent,
            children: allCats.filter((child) => child.parent_id === parent.id),
          }));
        setCategories(tree);
        if (saleRes.status && saleRes.data?.items) setSaleItems(saleRes.data.items);
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
      }
    };
    initData();
  }, []);

  // 2. Fetch Products với Filter
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 24 };

      // Tìm category ID từ slug
      const allFlatCategories = categories.flatMap((cat) => [cat, ...(cat.children || [])]);
      const foundCat = allFlatCategories.find((c) => c.slug === currentCategorySlug);
      if (foundCat) {
        params.category_id = foundCat.id;
        setCurrentCategoryName(foundCat.name);
      } else {
        setCurrentCategoryName("Tất cả sản phẩm");
      }

      // Thêm lọc giá (Nếu backend của bạn hỗ trợ params price_min/price_max)
      if (currentPriceRange !== "all") {
        const [min, max] = currentPriceRange.split("-");
        params.price_min = min;
        params.price_max = max;
      }

      const res = await ProductService.getList(params);
      let data = res?.data?.data || res?.data || [];

      // Logic Sort Client-side (Nếu backend chưa hỗ trợ sort)
      if (currentSort === "price-asc") data.sort((a, b) => a.price_buy - b.price_buy);
      if (currentSort === "price-desc") data.sort((a, b) => b.price_buy - a.price_buy);

      setProducts(data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, [currentCategorySlug, categories, currentPriceRange, currentSort]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProducts]);

  // Hàm update URL params
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) params.delete(key);
    else params.set(key, value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen text-[#1a1a1a] selection:bg-black selection:text-white">
      
      {/* 1. HERO HEADER */}
      <div className="bg-[#fcfcfc] py-24 border-b border-zinc-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-8 justify-center">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black font-bold">Atelier</span>
          </nav>
          <h1 className="text-6xl md:text-8xl font-extralight uppercase tracking-tighter mb-4 italic">
            {currentCategoryName}
          </h1>
          <p className="text-[11px] text-zinc-400 uppercase tracking-[0.5em]">L’art de la Boulangerie</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* 2. SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-16">
              
              {/* Category Filter */}
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 pb-4 border-b border-black flex justify-between">
                  Collections <ChevronDown size={14} />
                </h2>
                <nav className="space-y-4">
                  <button 
                    onClick={() => updateFilter("category", "")}
                    className={`block text-[12px] uppercase tracking-widest transition-all ${!currentCategorySlug ? "font-black translate-x-2 text-amber-900" : "text-zinc-400 hover:text-black"}`}
                  >
                    — View All
                  </button>
                  {categories.map((parent) => (
                    <div key={parent.id} className="space-y-3">
                      <button 
                        onClick={() => updateFilter("category", parent.slug)}
                        className={`block text-[12px] font-bold uppercase tracking-widest ${currentCategorySlug === parent.slug ? "text-amber-900 translate-x-2" : "text-zinc-500 hover:text-black"}`}
                      >
                        {parent.name}
                      </button>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Price Filter - NEW */}
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 pb-4 border-b border-black">
                  Filter by Price
                </h2>
                <div className="space-y-4">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio"
                        name="price-range"
                        className="w-4 h-4 accent-black"
                        checked={currentPriceRange === range.value}
                        onChange={() => updateFilter("price", range.value)}
                      />
                      <span className={`text-[12px] uppercase tracking-wider ${currentPriceRange === range.value ? "font-bold" : "text-zinc-400 group-hover:text-black"}`}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear All */}
              {(currentCategorySlug || currentPriceRange !== "all") && (
                <button 
                  onClick={() => router.push('/products')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:opacity-70"
                >
                  <X size={14} /> Reset Filters
                </button>
              )}
            </div>
          </aside>

          {/* 3. MAIN CONTENT */}
          <main className="flex-1">
            {/* TOOLBAR */}
            <div className="flex justify-between items-center mb-16 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-all ${viewMode === "grid" ? "text-black scale-110" : "text-zinc-300 hover:text-black"}`}>
                    <LayoutGrid size={20} strokeWidth={1} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-all ${viewMode === "list" ? "text-black scale-110" : "text-zinc-300 hover:text-black"}`}>
                    <List size={20} strokeWidth={1} />
                  </button>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {products.length} Masterpieces Found
                </span>
              </div>
              
              {/* Sort Dropdown */}
              <select 
                value={currentSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-b border-transparent hover:border-black transition-all"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* PRODUCT LISTING */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-10`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-zinc-50 aspect-[4/5] rounded-[2rem]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16" : "grid-cols-1 gap-12"}`}>
                {products.map((product, idx) => {
                  const isOutOfStock = (product.total_qty || 0) <= 0;
                  const saleMatch = saleItems.find((s) => Number(s.product_id) === Number(product.id));
                  const hasSale = saleMatch && Number(saleMatch.price_sale) < Number(product.price_buy);
                  const currentPrice = hasSale ? saleMatch.price_sale : product.price_buy;

                  return (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`} 
                      className={`group animate-fade-in ${viewMode === "list" ? "flex gap-12 items-center" : "block"}`}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden rounded-[2.5rem] bg-[#f9f9f9] transition-all duration-700 ${viewMode === "grid" ? "aspect-[4/5] mb-8" : "w-80 aspect-square shrink-0"}`}>
                        <img
                          src={product.thumbnail_url}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-transform duration-[2s] ${isOutOfStock ? "grayscale opacity-30" : "group-hover:scale-110"}`}
                        />
                        {hasSale && !isOutOfStock && (
                          <div className="absolute top-8 left-8 bg-black text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl">
                            SALE
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sold Out</span>
                          </div>
                        )}
                        {viewMode === "grid" && !isOutOfStock && (
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                             <div className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 scale-90 group-hover:scale-100 transition-transform duration-500">
                                <ShoppingBag size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Select</span>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className={viewMode === "list" ? "flex-1" : "text-center px-4"}>
                        <h3 className={`uppercase tracking-[0.15em] leading-tight mb-3 transition-colors ${viewMode === "list" ? "text-4xl font-extralight" : "text-[13px] font-bold"} ${isOutOfStock ? "text-zinc-300" : "group-hover:text-amber-900"}`}>
                          {product.name}
                        </h3>
                        <div className={`flex items-center gap-4 ${viewMode === "grid" ? "justify-center" : "justify-start mt-6"}`}>
                          <span className={`text-lg tracking-tighter ${hasSale ? "text-red-600 font-black" : "font-light"}`}>
                            {Number(currentPrice).toLocaleString()}₫
                          </span>
                          {hasSale && (
                            <span className="text-xs text-zinc-300 line-through font-light">
                              {Number(product.price_buy).toLocaleString()}₫
                            </span>
                          )}
                        </div>
                        {viewMode === "list" && !isOutOfStock && (
                          <button className="mt-10 bg-black text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-900 transition-colors">
                            Add to Atelier Bag
                          </button>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-40 text-center rounded-[4rem] border border-dashed border-zinc-200 bg-zinc-50/50">
                <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400 mb-6">Nothing found in our oven today</p>
                <button onClick={() => router.push('/products')} className="text-[10px] font-black uppercase border-b-2 border-black pb-1">Reset All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { opacity: 0; animation: fade-in 1s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}