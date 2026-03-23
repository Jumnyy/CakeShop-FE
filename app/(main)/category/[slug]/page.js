"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CategoryService from "@/services/CategoryService";
import ProductService from "@/services/ProductService";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Lấy thông tin category theo slug
        const categoryRes = await CategoryService.getList({ limit: 999 });
        const allCategories = categoryRes.data || [];
        const cat = allCategories.find((c) => c.slug === slug);
        if (!cat) {
          setCategory(null);
          setProducts([]);
          return;
        }
        setCategory(cat);

        // 2️⃣ Lấy sản phẩm theo category_id
        const productRes = await ProductService.getList({
          category_id: cat.id,
          limit: 100,
        });

        if (productRes.status) {
          setProducts(productRes.data || []);
        }
      } catch (err) {
        console.error("Lỗi load category page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p className="text-center py-20">Đang tải...</p>;

  if (!category)
    return <p className="text-center py-20">Danh mục không tồn tại</p>;

  return (
    <div className="px-16 py-8">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6 uppercase">{category.name}</h1>

      {/* PRODUCT LIST */}
      {products.length === 0 ? (
        <p className="text-gray-500">Chưa có sản phẩm</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =================== ProductCard =================== */
function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      {/* Image */}
      <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-red-600 font-bold">
          {Number(product.price_buy || 0).toLocaleString()}₫
        </p>
      </div>
    </Link>
  );
}
