"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryService from "@/services/CategoryService";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "",
    sort_order: "",
    status: 1,
  });

  // 1️⃣ Lấy dữ liệu category
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await CategoryService.getById(id);

        const data = res.data; // 🔥 SỬA DÒNG NÀY

        setForm({
          name: data.name || "",
          slug: data.slug || "",
          image: data.image || "",
          description: data.description || "",
          parent_id: data.parent_id || "",
          sort_order: data.sort_order || "",
          status: data.status ?? 1,
        });
      } catch (err) {
        alert("Không tìm thấy danh mục");
        router.push("/admin/category");
      }
    }

    fetchCategory();
  }, [id]);

  // 2️⃣ Handle input change
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 3️⃣ Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description || "");
      formData.append("parent_id", form.parent_id || "");
      formData.append("sort_order", form.sort_order || "");
      formData.append("status", form.status ? 1 : 0);

      // file
      if (image instanceof File) {
        formData.append("image", image);
      }

      // 🔥 spoof method
      formData.append("_method", "PUT");

      await CategoryService.update(id, formData);

      alert("Cập nhật danh mục thành công");
      router.push("/admin/category");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ✏️ Chỉnh sửa danh mục
          </h1>

          <button
            onClick={() => router.push("/admin/category")}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
          >
            ⬅ Quay lại
          </button>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Hình ảnh
              </label>

              <div className="flex items-center gap-6">
                {/* Ảnh hiện tại */}
                {form.image && !image && (
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-xl border shadow overflow-hidden mx-auto">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/category/${form.image}`}
                        alt="Category"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ảnh hiện tại</p>
                  </div>
                )}

                {/* Upload */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block text-sm"
                  />

                  {image && (
                    <p className="text-sm text-green-600 mt-2">
                      ✔️ Đã chọn ảnh mới
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border
              focus:ring-2 focus:ring-green-500 outline-none transition"
              >
                <option value={1}>🟢 Hiển thị</option>
                <option value={0}>⚪ Ẩn</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push("/admin/category")}
                className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:scale-105 transition shadow-lg
              disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "⏳ Đang cập nhật..." : "💾 Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
