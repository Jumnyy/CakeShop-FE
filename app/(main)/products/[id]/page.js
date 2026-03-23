"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductService from "@/services/ProductService";
import CartService from "@/services/CartService";
import Link from "next/link";
import { Clock, ShoppingBag, ArrowRight } from "lucide-react"; // Thêm ArrowRight cho đẹp

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [salePrice, setSalePrice] = useState(null);
  
  // --- THÊM STATE CHO SẢN PHẨM LIÊN QUAN ---
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setSalePrice(null);

        const [productRes, saleRes] = await Promise.all([
          ProductService.getById(id),
          ProductService.getSale(),
        ]);

        const productData = productRes.data?.data || productRes.data;
        setProduct(productData);
        setMainImage(productData.thumbnail_url);

        // --- LOGIC LẤY SẢN PHẨM LIÊN QUAN (CÙNG CATEGORY) ---
        if (productData.category_id) {
          const relatedRes = await ProductService.getList({
            category_id: productData.category_id,
            limit: 5, // Lấy 5 sản phẩm
          });
          const relatedData = relatedRes.data?.data || relatedRes.data || [];
          // Lọc bỏ sản phẩm hiện tại khỏi danh sách liên quan
          setRelatedProducts(relatedData.filter(p => Number(p.id) !== Number(id)).slice(0, 4));
        }

        // --- LOGIC KIỂM TRA SALE CẨN THẬN (CODE GỐC) ---
        if (saleRes && saleRes.status && saleRes.data?.items) {
          const flashSaleItem = saleRes.data.items.find(
            (item) => Number(item.product_id) === Number(id)
          );

          if (
            flashSaleItem &&
            Number(flashSaleItem.price_sale) < Number(productData.price_buy)
          ) {
            setSalePrice(Number(flashSaleItem.price_sale));
          } else {
            setSalePrice(null);
          }
        } else {
          setSalePrice(null);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setSalePrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Cuộn lên đầu trang khi đổi sản phẩm
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const currentPrice = salePrice || product?.price_buy;
  const hasSale = salePrice !== null;
  const isOutOfStock = !product || (product.total_qty || 0) <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const totalAttrs = product.attributes?.length || 0;
    if (Object.keys(selectedAttributes).length < totalAttrs) {
      alert("Vui lòng chọn đầy đủ tùy chọn!");
      return;
    }

    try {
      await CartService.addToCart(
        {
          ...product,
          price: currentPrice,
          selectedOptions: selectedAttributes,
        },
        quantity
      );
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (err) {
      alert("Lỗi khi thêm vào giỏ.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse text-xs uppercase tracking-widest">
        Đang tải...
      </div>
    );
  if (!product)
    return (
      <div className="py-20 text-center uppercase tracking-widest">
        Sản phẩm không tồn tại.
      </div>
    );

  return (
    <div className="bg-white min-h-screen text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs (Giữ nguyên) */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-10">
          <Link href="/" className="hover:text-black">
            Trang chủ
          </Link>{" "}
          / <span className="text-black font-bold ml-2">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Gallery (Giữ nguyên) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 w-full md:w-20">
              {[
                product.thumbnail_url,
                ...(product.images?.map((img) => img.image_url) || []),
              ].map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(url)}
                  className={`aspect-square cursor-pointer border ${
                    mainImage === url
                      ? "border-black"
                      : "border-transparent opacity-50"
                  }`}
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-[#f9f9f9] relative group overflow-hidden">
              <img
                src={mainImage}
                className={`w-full aspect-[4/5] object-cover transition-transform duration-[1.5s] group-hover:scale-105 ${
                  isOutOfStock ? "grayscale" : ""
                }`}
              />
              {hasSale && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  Flash Sale
                </div>
              )}
            </div>
          </div>

          {/* Info (Giữ nguyên) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-[0.3em] block mb-2">
                Fresh Garden Bakery
              </span>
              <h1 className="text-4xl font-extralight uppercase tracking-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8 py-6 border-y border-gray-100">
                <span
                  className={`text-3xl font-medium ${
                    hasSale ? "text-red-600" : "text-black"
                  }`}
                >
                  {Number(currentPrice).toLocaleString()}₫
                </span>
                {hasSale && (
                  <span className="text-lg text-gray-400 line-through font-extralight">
                    {Number(product.price_buy).toLocaleString()}₫
                  </span>
                )}
              </div>

              <div className="space-y-6 mb-10">
                {product.attributes?.map((attr, index) => (
                  <div key={index}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">
                      {attr.name}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {attr.options?.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [attr.name]: opt.value,
                            }))
                          }
                          className={`px-5 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                            selectedAttributes[attr.name] === opt.value
                              ? "bg-black text-white border-black"
                              : "border-gray-200 text-gray-500 hover:border-black"
                          }`}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex items-center border border-gray-200 rounded-full px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-12"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.total_qty, q + 1))
                    }
                    className="w-10 h-12"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400"
                      : "bg-black text-white hover:bg-[#333]"
                  }`}
                >
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- PHẦN SẢN PHẨM LIÊN QUAN (THÊM MỚI) --- */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-100 pt-20 pb-10">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-[0.3em] block mb-2">Discovery</span>
                <h2 className="text-2xl font-extralight uppercase tracking-widest">Sản phẩm liên quan</h2>
              </div>
              <Link href="/products" className="text-[10px] font-bold uppercase border-b border-black pb-1 flex items-center gap-2 hover:text-amber-800 transition-colors">
                Xem tất cả <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="group">
                  <div className="aspect-[4/5] bg-zinc-50 overflow-hidden mb-4 relative rounded-2xl">
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-1 group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-light text-gray-500">
                    {Number(item.price_buy).toLocaleString()}₫
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}