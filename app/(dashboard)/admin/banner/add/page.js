"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BannerService from "@/services/BannerService";
import {
  Save,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function BannerAdd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("slideshow");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);

  // Image & Preview
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Xử lý Preview ảnh để tránh memory leak
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    // Dọn dẹp bộ nhớ khi component unmount hoặc file thay đổi
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Giới hạn 2MB
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!name) return alert("Vui lòng nhập tên Banner!");
    if (!imageFile) return alert("Vui lòng chọn hình ảnh!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("link", link);
      formData.append("position", position);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("image", imageFile);

      const res = await BannerService.create(formData);

      if (res.data && res.data.status) {
        router.push("/admin/banner");
      } else {
        alert("⚠️ " + (res.data?.message || "Thao tác thất bại"));
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        let errorMsg = Object.values(errors).flat().join("\n");
        alert("⛔ LỖI DỮ LIỆU:\n" + errorMsg);
      } else {
        alert("❌ Lỗi hệ thống: " + (error.response?.status || "Unknown"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/banner"
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Thêm Banner Mới
          </h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Lưu Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: MAIN INFO */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Tên Banner chiến dịch
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all outline-none font-bold text-slate-700 placeholder:font-medium"
                  placeholder="Ví dụ: Khuyến mãi mùa hè 2024"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Đường dẫn (Link)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-orange-500 transition-all outline-none font-bold text-slate-700"
                  placeholder="https://yourstore.com/collection/summer"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-orange-500 transition-all outline-none font-bold text-slate-700"
                  placeholder="Nhập nội dung hiển thị hoặc ghi chú..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: IMAGE & STATUS */}
        <div className="lg:col-span-4 space-y-6">
          {/* UPLOAD BOX */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
              Hình ảnh hiển thị
            </label>

            <div
              className={`relative group border-2 border-dashed rounded-[24px] overflow-hidden transition-all ${
                previewUrl
                  ? "border-orange-200"
                  : "border-slate-200 hover:border-orange-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
              />

              {previewUrl ? (
                <div className="relative aspect-video w-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold text-sm bg-orange-600 px-4 py-2 rounded-xl">
                      Thay đổi ảnh
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-50">
                    <Upload size={32} />
                  </div>
                  <p className="font-bold text-sm">Chọn tệp hình ảnh</p>
                  <p className="text-[10px] uppercase tracking-tighter mt-1 font-medium">
                    PNG, JPG tối đa 2MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CONFIG BOX */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Vị trí hiển thị
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none font-bold text-slate-700 appearance-none focus:bg-white focus:border-orange-500 transition-all"
              >
                <option value="slideshow">Trang chủ (Slideshow)</option>
                <option value="ads">Banner Quảng cáo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Trạng thái kích hoạt
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setStatus(1)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                    status == 1
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <CheckCircle2 size={16} /> Hiện
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(0)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                    status == 0
                      ? "bg-white text-slate-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <AlertCircle size={16} /> Ẩn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
