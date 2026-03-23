"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BannerService from "@/services/BannerService";
import Link from "next/link";
import {
  Save,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Upload,
  ChevronLeft,
  LayoutDashboard,
  Settings2,
  AlertCircle,
} from "lucide-react";

export default function BannerEdit() {
  const router = useRouter();
  const { id } = useParams();

  // State Form
  const [form, setForm] = useState({
    name: "",
    link: "",
    position: "slideshow",
    sort_order: 0,
    description: "",
    status: 1,
  });

  // State Quản lý ảnh
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const getBackendImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = "http://localhost:8000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  // 1. LOAD DATA
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await BannerService.getById(id);
        let banner = res.data?.data || res.data;

        if (banner) {
          setForm({
            name: banner.name || "",
            link: banner.link || "",
            position: banner.position || "slideshow",
            sort_order: banner.sort_order ?? 0,
            description: banner.description || "",
            status: banner.status ?? 1,
          });
          setCurrentImageUrl(banner.image_url || banner.image || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. XỬ LÝ ẢNH & CLEANUP
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCancelNewImage = (e) => {
    e.preventDefault();
    setNewImageFile(null);
    setPreviewUrl("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", form.name);
      formData.append("link", form.link || "");
      formData.append("position", form.position);
      formData.append("sort_order", form.sort_order);
      formData.append("description", form.description || "");
      formData.append("status", form.status);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      await BannerService.update(id, formData);
      router.push("/admin/banner");
    } catch (error) {
      console.error(error);
      alert("❌ Cập nhật thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">
          Đang tải thông tin banner...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/banner"
            className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Sửa Banner: <span className="text-orange-600">#{id}</span>
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-orange-100 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Cập nhật thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: FORM CHÍNH */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <LayoutDashboard size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Nội dung hiển thị
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Tên Banner
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập tên banner..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Đường dẫn đích (Link)
                </label>
                <div className="relative">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Mô tả ngắn
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Thông tin bổ sung về banner này..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: MEDIA & SETTINGS */}
        <div className="lg:col-span-4 space-y-6">
          {/* IMAGE PREVIEW */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} className="text-orange-500" /> Hình ảnh
              </span>
            </div>

            <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex flex-col items-center justify-center transition-all hover:border-orange-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />

              {previewUrl || currentImageUrl ? (
                <>
                  <img
                    src={previewUrl || getBackendImageUrl(currentImageUrl)}
                    className="w-full h-full object-cover"
                    alt="Banner Preview"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
                    <div className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-800 shadow-xl flex items-center gap-2">
                      <Upload size={14} /> Thay đổi ảnh
                    </div>
                    {previewUrl && (
                      <button
                        onClick={handleCancelNewImage}
                        className="bg-red-500 p-2 rounded-xl text-white shadow-xl hover:scale-110 transition-transform z-30"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Upload size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase mt-2">
                    Chưa có ảnh
                  </span>
                </div>
              )}
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-medium text-center italic">
              * Khuyên dùng: 1920x600 (Slideshow) | 800x400 (Ads)
            </p>
          </div>

          {/* CONFIG */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Settings2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Cấu hình
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                Vị trí hiển thị
              </label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-slate-700 appearance-none focus:bg-white focus:border-orange-500 transition-all"
              >
                <option value="slideshow">Trang chủ (Slideshow)</option>
                <option value="ads">Banner Quảng cáo (Ads)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                Trạng thái
              </label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 1 })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    form.status == 1
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  HIỂN THỊ
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 0 })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    form.status == 0
                      ? "bg-white text-slate-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  ẨN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
