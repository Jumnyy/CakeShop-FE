"use client";

import { useState, useEffect } from "react";
import CategoryService from "../../../../../services/CategoryService";
import ProductService from "../../../../../services/ProductService";
import AttributeService from "../../../../../services/AttributeService";
import Link from "next/link";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [priceBuy, setPriceBuy] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState(1);

  // ===== HÌNH ẢNH =====
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [images, setImages] = useState([]); // File ảnh phụ
  const [previewImages, setPreviewImages] = useState([]); // URL để xem trước ảnh phụ

  // ===== DỮ LIỆU TỪ API =====
  const [categories, setCategories] = useState([]);
  const [dbAttributes, setDbAttributes] = useState([]);

  // ===== BIẾN THỂ / THUỘC TÍNH =====
  const [hasVariants, setHasVariants] = useState(false);
  const [attributes, setAttributes] = useState([
    { name: "", values: [], temp: "" },
  ]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    (async () => {
      const resCat = await CategoryService.getList({ limit: 999, page: 1 });
      setCategories(resCat?.data || []);

      const resAttr = await AttributeService.getList();
      if (resAttr?.status) {
        setDbAttributes(resAttr.data || []);
      }
    })();
  }, []);

  /* ================= XỬ LÝ ẢNH ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    // Tạo danh sách preview cho nhiều ảnh
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* ================= THUỘC TÍNH ================= */
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [], temp: "" }]);
  };

  const updateAttribute = (index, key, value) => {
    const newAttrs = [...attributes];
    newAttrs[index][key] = value;
    setAttributes(newAttrs);
  };

  const addValue = (index) => {
    const newAttrs = [...attributes];
    const v = newAttrs[index].temp.trim();
    if (v && !newAttrs[index].values.includes(v)) {
      newAttrs[index].values.push(v);
    }
    newAttrs[index].temp = "";
    setAttributes(newAttrs);
  };

  const removeValue = (attrIndex, valueIndex) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values.splice(valueIndex, 1);
    setAttributes(newAttrs);
  };

  const removeAttribute = (index) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanAttributes = attributes
      .map((a) => {
        const finalValues = [...a.values];
        if (a.temp?.trim() && !finalValues.includes(a.temp.trim())) {
          finalValues.push(a.temp.trim());
        }
        return { name: a.name?.trim(), values: finalValues };
      })
      .filter((a) => a.name && a.values.length > 0);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("category_id", Number(categoryId));
    formData.append("price_buy", Number(priceBuy));
    formData.append("status", status ? 1 : 0);

    if (thumbnail) formData.append("thumbnail", thumbnail);

    // Gửi mảng ảnh phụ
    images.forEach((img) => {
      formData.append("images[]", img);
    });

    if (hasVariants && cleanAttributes.length > 0) {
      formData.append("attributes", JSON.stringify(cleanAttributes));
    }

    try {
      const res = await ProductService.create(formData);
      if (res.status) {
        alert("Thêm sản phẩm thành công!");
        window.location.href = "/admin/product";
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu sản phẩm!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          ➕ Thêm sản phẩm mới
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/product"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold"
          >
            💾 Lưu sản phẩm
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">
              Tên sản phẩm *
            </label>
            <input
              className="mt-2 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">Mô tả ngắn</label>
            <textarea
              className="mt-2 w-full border rounded-lg px-3 py-2 outline-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">
              Nội dung chi tiết
            </label>
            <textarea
              className="mt-2 w-full border rounded-lg px-3 py-2 outline-none"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          {/* DANH MỤC */}
          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">Danh mục *</label>
            <select
              className="mt-2 w-full border rounded-lg px-3 py-2 bg-white"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* GIÁ */}
          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">Giá bán</label>
            <input
              type="number"
              className="mt-2 w-full border rounded-lg px-3 py-2"
              value={priceBuy}
              onChange={(e) => setPriceBuy(e.target.value)}
            />
          </div>

          {/* HÌNH ẢNH ĐẠI DIỆN */}
          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">Ảnh đại diện</label>
            <input
              type="file"
              onChange={handleImage}
              className="mt-3 block w-full text-sm text-gray-500"
            />
            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 w-full h-48 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* ẢNH PHỤ (GALLERY) */}
          <div className="bg-white rounded-xl shadow p-5">
            <label className="font-semibold text-gray-700">
              Bộ sưu tập ảnh (Ảnh phụ)
            </label>
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="mt-3 block w-full text-sm text-gray-500"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full h-20 object-cover rounded-lg border shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* THUỘC TÍNH */}
          <div className="bg-white rounded-xl shadow p-5 border-t-4 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800">
                Thuộc tính sản phẩm
              </span>
              <button
                type="button"
                onClick={() => setHasVariants(!hasVariants)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  hasVariants
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {hasVariants ? "Hủy" : "+ Kích hoạt"}
              </button>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="absolute top-1 right-2 text-red-400 font-bold"
                    >
                      ✕
                    </button>

                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Tên thuộc tính
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 mb-2 bg-white text-sm"
                      value={attr.name}
                      onChange={(e) =>
                        updateAttribute(index, "name", e.target.value)
                      }
                    >
                      <option value="">-- Chọn --</option>
                      {dbAttributes.map((dbAttr) => (
                        <option key={dbAttr.id} value={dbAttr.name}>
                          {dbAttr.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <input
                        className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                        placeholder="Giá trị..."
                        value={attr.temp}
                        onChange={(e) =>
                          updateAttribute(index, "temp", e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addValue(index))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => addValue(index)}
                        className="px-3 rounded-lg bg-gray-700 text-white text-xs"
                      >
                        Thêm
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {attr.values.map((v, vIdx) => (
                        <span
                          key={vIdx}
                          className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px] flex items-center"
                        >
                          {v}{" "}
                          <button
                            type="button"
                            onClick={() => removeValue(index, vIdx)}
                            className="ml-1.5 font-bold text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttribute}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs hover:bg-white"
                >
                  + Thêm nhóm thuộc tính
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
