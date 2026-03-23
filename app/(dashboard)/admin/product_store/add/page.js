"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import Product_storeService from "@/services/Product_storeService";
import ProductService from "@/services/ProductService";

const ProductStoreAdd = () => {
  const router = useRouter(); // 2. Khởi tạo router
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    price_root: "",
    qty: "",
    status: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getList();
        setProducts(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id) {
      alert("Vui lòng chọn một sản phẩm");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        product_id: Number(form.product_id),
        price_root: Number(form.price_root),
        qty: Number(form.qty),
        status: Number(form.status),
      };

      const res = await Product_storeService.create(dataToSend);

      // Lưu ý: Tùy vào cấu trúc API trả về là res.data.status hay res.status
      if (res.data.status || res.status === 200 || res.status === 201) {
        alert("✅ Thêm kho sản phẩm thành công");

        // 3. Lệnh chuyển hướng về trang danh sách
        router.push("/admin/product_store");
      } else {
        alert(res.data.message || "❌ Thêm kho sản phẩm thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Có lỗi xảy ra khi lưu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-white">
              📦 Nhập Hàng Vào Kho
            </h2>
            {/* Nút quay lại nhanh nếu không muốn nhập nữa */}
            <button
              onClick={() => router.back()}
              className="text-emerald-100 hover:text-white text-sm underline"
            >
              Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🛒 Chọn Sản Phẩm
              </label>
              <select
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white transition"
              >
                <option value="">-- Chọn sản phẩm cần nhập --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    ID: {prod.id} - {prod.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  💰 Giá Nhập (VNĐ)
                </label>
                <input
                  type="number"
                  name="price_root"
                  value={form.price_root}
                  onChange={handleChange}
                  placeholder="VD: 120000"
                  min="0"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  📦 Số Lượng Nhập
                </label>
                <input
                  type="number"
                  name="qty"
                  value={form.qty}
                  onChange={handleChange}
                  placeholder="VD: 50"
                  min="1"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⚙️ Trạng Thái Kho
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white transition"
              >
                <option value={1}>✅ Hoạt động (Có thể bán)</option>
                <option value={0}>❌ Ẩn (Chỉ lưu kho)</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/product_store")}
                className="flex-1 h-12 rounded-xl text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-[2] h-12 rounded-xl text-white font-semibold
                  bg-gradient-to-r from-emerald-500 to-teal-600
                  hover:opacity-90 active:scale-95 transition shadow-lg"
              >
                💾 Xác Nhận Nhập Kho
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductStoreAdd;
