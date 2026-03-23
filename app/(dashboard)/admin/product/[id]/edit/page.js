"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductService from "@/services/ProductService";
import CategoryService from "@/services/CategoryService";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Plus,
  X,
  Package,
  ListTodo,
  Trash2,
  Layers,
} from "lucide-react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    slug: "",
    content: "",
    description: "",
    price_buy: "",
    status: 1,
  });

  const [attributes, setAttributes] = useState([]); // Quản lý Size, Màu...
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /* ================= 1. LOAD DATA ================= */
  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await ProductService.getById(id);
      if (res.status) {
        const p = res.data;
        setForm({
          category_id: p.category_id,
          name: p.name,
          slug: p.slug,
          content: p.content,
          description: p.description || "",
          price_buy: p.price_buy,
          status: p.status,
        });
        setThumbnailPreview(p.thumbnail_url);
        setOldImages(p.images || []);

        // Load thuộc tính hiện tại của sản phẩm
        if (p.product_attributes) {
          setAttributes(
            p.product_attributes.map((attr) => ({
              id: attr.id,
              name: attr.attribute?.name || "",
              value: attr.value || "",
            }))
          );
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const res = await CategoryService.getList({ limit: 999 });
      if (res.status) setCategories(res.data);
    })();
  }, []);

  /* ================= 2. XỬ LÝ THUỘC TÍNH (ATTRIBUTES) ================= */
  const addAttributeField = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const removeAttributeField = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, val) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = val;
    setAttributes(newAttrs);
  };

  /* ================= 3. XỬ LÝ ẢNH & FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const removeOldImage = async (imgId) => {
    if (!confirm("Xoá ảnh này khỏi thư viện?")) return;
    try {
      await ProductService.deleteImage(imgId);
      setOldImages(oldImages.filter((img) => img.id !== imgId));
    } catch (err) {
      alert("Lỗi khi xóa ảnh");
    }
  };

  /* ================= 4. SUBMIT DỮ LIỆU ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("_method", "PUT");

    // Thêm các trường cơ bản
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    // Thêm ảnh
    if (thumbnail) formData.append("thumbnail", thumbnail);
    newImages.forEach((img) => formData.append("images[]", img));

    // Thêm danh sách thuộc tính (Gửi dưới dạng chuỗi JSON)
    formData.append("attributes", JSON.stringify(attributes));

    try {
      const res = await ProductService.update(id, formData);
      if (res.status) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin/product");
      } else {
        alert("Có lỗi xảy ra: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-tight">
              ID: #{id}
            </p>
          </div>
        </div>
        <button
          form="product-form"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
        >
          {loading ? (
            "Đang lưu..."
          ) : (
            <>
              <Save size={18} /> Lưu thay đổi
            </>
          )}
        </button>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* CỘT TRÁI: THÔNG TIN VÀ THUỘC TÍNH */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-indigo-500" /> Thông tin cơ bản
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Tên sản phẩm
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Slug (Đường dẫn)
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Mô tả ngắn
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Nội dung chi tiết
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* QUẢN LÝ THUỘC TÍNH (NEW) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ListTodo size={20} className="text-indigo-500" /> Thuộc tính
                sản phẩm
              </h2>
              <button
                type="button"
                onClick={addAttributeField}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} /> Thêm dòng
              </button>
            </div>

            <div className="space-y-3">
              {attributes.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-sm text-slate-400 italic">
                    Sản phẩm này chưa có thuộc tính (Size, Màu sắc...)
                  </p>
                </div>
              )}
              {attributes.map((attr, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center group animate-in fade-in slide-in-from-top-1"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      placeholder="Tên (Size, Màu...)"
                      value={attr.name}
                      onChange={(e) =>
                        handleAttributeChange(index, "name", e.target.value)
                      }
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <input
                      placeholder="Giá trị (M, L, Đỏ...)"
                      value={attr.value}
                      onChange={(e) =>
                        handleAttributeChange(index, "value", e.target.value)
                      }
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttributeField(index)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Thư viện ảnh phụ */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-indigo-500" /> Thư viện ảnh
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {oldImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <img
                    src={img.image_url}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={() => removeOldImage(img.id)}
                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all">
                <Plus size={24} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                  Thêm ảnh
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleNewImages}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIÁ & THUMBNAIL */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Ảnh đại diện
            </h2>
            <div className="relative group mx-auto w-48 h-48 mb-4">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  className="w-full h-full object-cover rounded-2xl border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <ImageIcon size={40} className="text-slate-300" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer font-semibold text-xs">
                Thay đổi ảnh
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Layers size={16} className="text-indigo-500" /> Giá bán (VNĐ)
              </label>
              <input
                type="number"
                name="price_buy"
                value={form.price_buy}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600 outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Danh mục
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Trạng thái
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={1}
                    checked={Number(form.status) === 1}
                    onChange={handleChange}
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-600">
                    Hiển thị
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={0}
                    checked={Number(form.status) === 0}
                    onChange={handleChange}
                    className="accent-rose-600 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-600">Ẩn</span>
                </label>
              </div>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
}
