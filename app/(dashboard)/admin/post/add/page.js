"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostService from "@/services/PostService";
import {
  Save,
  RotateCcw,
  Image as ImageIcon,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AddPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Biến state của bạn tên là 'form'
  const [form, setForm] = useState({
    topic_id: "",
    title: "",
    description: "",
    content: "",
    post_type: "post",
    status: 1,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    // Khởi tạo FormData
    const formData = new FormData();

    // ĐÃ SỬA: Thay 'data' bằng 'form' cho khớp với khai báo phía trên
    formData.append("title", form.title);
    formData.append("topic_id", form.topic_id);
    formData.append("content", form.content);
    formData.append("description", form.description || "");
    formData.append("post_type", form.post_type === "post" ? 1 : 2); // Chuyển đổi sang Integer cho Laravel
    formData.append("status", form.status);

    // Thêm file ảnh (Lấy từ state 'image')
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await PostService.create(formData);

      if (response.data.status) {
        alert("✅ Thêm bài viết thành công!");
        router.push("/admin/post"); // Chuyển hướng về danh sách
      }
    } catch (error) {
      if (error.response) {
        // Log toàn bộ data để xem Laravel thực sự trả về cái gì
        console.log("Full Server Response:", error.response.data);

        // Nếu Laravel trả về message thay vì errors
        const message = error.response.data.message || "Lỗi không xác định";
        const errors = error.response.data.errors || {};

        if (Object.keys(errors).length > 0) {
          alert("Lỗi dữ liệu:\n" + Object.values(errors).flat().join("\n"));
        } else {
          alert("Thông báo từ server: " + message);
        }
      }
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      {/* HEADER BREADCRUMB */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/admin/post"
            className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors font-medium mb-1"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Viết Bài Mới
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-100 rounded-[24px] p-6 space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all outline-none font-bold text-gray-700"
                placeholder="Nhập tiêu đề hấp dẫn..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Mô tả ngắn (Sapo)
              </label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:border-pink-500 transition-all outline-none font-medium text-gray-600"
                placeholder="Tóm tắt nội dung bài viết..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Nội dung chi tiết
              </label>
              <textarea
                rows={12}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:border-pink-500 transition-all outline-none font-medium text-gray-700"
                placeholder="Viết nội dung tại đây..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CẤU HÌNH & ẢNH */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-100 rounded-[24px] p-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-4 rounded-xl font-black hover:bg-gray-700 transition-all shadow-lg shadow-pink-100 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              LƯU BÀI VIẾT
            </button>
            <button
              type="reset"
              onClick={() => {
                setPreview(null);
                setImage(null);
                setForm({
                  topic_id: "",
                  title: "",
                  description: "",
                  content: "",
                  post_type: "post",
                  status: 1,
                });
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 text-gray-400 py-2 font-bold hover:text-gray-600 transition-colors"
            >
              <RotateCcw size={16} /> Làm mới form
            </button>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-[24px] p-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Chủ đề (Topic)
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500 font-bold text-gray-700"
                value={form.topic_id}
                onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                required
              >
                <option value="">-- Chọn chủ đề --</option>
                <option value="1">Tin tức</option>
                <option value="2">Khuyến mãi</option>
                <option value="3">Sự kiện</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Loại bài viết
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500 font-bold text-gray-700"
                value={form.post_type}
                onChange={(e) =>
                  setForm({ ...form, post_type: e.target.value })
                }
              >
                <option value="post">Bài viết (Post)</option>
                <option value="page">Trang đơn (Page)</option>
              </select>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-[24px] p-6">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 tracking-tighter">
              Ảnh đại diện bài viết
            </label>
            <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-pink-400 transition-all aspect-video flex items-center justify-center bg-gray-50">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                onChange={handleFileChange}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-xs font-bold text-gray-400">
                    Click hoặc kéo ảnh vào đây
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
