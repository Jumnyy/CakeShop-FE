"use client";

import { useState, useEffect } from "react";
import CategoryService from "@/services/CategoryService";
import Link from "next/link";

// Tạo slug chuẩn SEO
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parentId, setParentId] = useState(0);
  const [sortOrder, setSortOrder] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [categories, setCategories] = useState([]);

  // Load danh mục cha
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getList({ limit: 999, page: 1 });
        setCategories(res.data || []);
      } catch (e) {
        console.error("Lỗi load danh mục:", e);
      }
    })();
  }, []);

  // Auto slug theo tên
  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  // Preview image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("parent_id", Number(parentId));
    formData.append("sort_order", Number(sortOrder));
    formData.append("description", description);
    formData.append("status", Number(status));
    if (image) formData.append("image", image);

    try {
      await CategoryService.create(formData);
      alert("Thêm danh mục thành công!");
      window.location.href = "/admin/category";
    } catch (error) {
      console.error("Lỗi tạo danh mục:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between text-white">
          <h1 className="text-2xl font-extrabold">➕ Thêm danh mục</h1>
          <Link
            href="/admin/category"
            className="px-4 py-2 rounded-xl bg-white text-emerald-600 font-medium hover:bg-emerald-50 transition"
          >
            ⬅ Quay lại
          </Link>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Tên danh mục
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Ví dụ: Điện thoại, Laptop..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Slug (SEO)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border bg-gray-100 text-gray-500 cursor-not-allowed"
                value={slug}
                readOnly
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Mô tả
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Mô tả ngắn cho danh mục..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Hình ảnh
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <div className="w-24 h-24 rounded-xl border shadow overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parent */}
              <div>
                <label className="block mb-1 font-medium">Danh mục cha</label>
                <select
                  className="border p-2 w-full rounded"
                  value={parentId}
                  onChange={(e) => setParentId(Number(e.target.value))}
                >
                  <option value={0}>— Không có —</option>
                  {categories
                    .filter((cat) => !cat.parent_id) // chỉ lấy danh mục cha
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* Sort */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Thứ tự
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Trạng thái
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={1}>🟢 Hiển thị</option>
                <option value={0}>⚪ Ẩn</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <Link
                href="/admin/category"
                className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </Link>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 transition shadow-lg"
              >
                💾 Lưu danh mục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
