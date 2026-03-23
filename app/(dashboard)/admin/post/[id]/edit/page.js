"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostService from "@/services/PostService";
import TopicService from "@/services/TopicService";
import { ChevronLeft, Save, Upload, Loader2 } from "lucide-react";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [topics, setTopics] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    topic_id: "",
    title: "",
    description: "",
    content: "",
    post_type: "post",
    status: 1,
  });

  const API_URL = "http://localhost:8000";

  // 1. Load danh sách Topic và Dữ liệu bài viết
  useEffect(() => {
    const loadData = async () => {
      try {
        const topicRes = await TopicService.getList({ limit: 100 });
        setTopics(topicRes.data?.data || topicRes.data || []);

        if (id) {
          const postRes = await PostService.getById(id);
          const p = postRes.data?.data || postRes.data;

          setForm({
            topic_id: p.topic_id || "",
            title: p.title || "",
            description: p.description || "",
            content: p.content || "",
            post_type: p.post_type || "post",
            status: p.status ?? 1,
          });

          // Hiển thị ảnh cũ từ folder storage/posts (khớp với Controller add của bạn)
          if (p.image) {
            setPreview(`${API_URL}/storage/${p.image}`);
          }
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Submit cập nhật
  const submit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Laravel yêu cầu _method=PUT khi dùng FormData gửi qua POST để update
    formData.append("_method", "PUT");

    formData.append("topic_id", form.topic_id);
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("description", form.description || "");
    formData.append("post_type", form.post_type === "post" ? 1 : 2); // Chuyển sang Integer theo Validate của Laravel
    formData.append("status", Number(form.status)); // Đảm bảo là Integer

    if (image) {
      formData.append("image", image);
    }

    try {
      await PostService.update(id, formData);
      alert("✅ Cập nhật bài viết thành công");
      router.push("/admin/post");
      router.refresh(); // Làm mới dữ liệu client
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        console.error("Lỗi Validation:", errors);
        alert("⛔ Lỗi dữ liệu: " + Object.values(errors).flat().join("\n"));
      } else {
        alert("❌ Lỗi hệ thống: " + (error.response?.data?.message || "Không thể cập nhật"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-sky-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium">Đang lấy dữ liệu bài viết...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => router.push("/admin/post")}
              className="flex items-center gap-1 text-gray-500 hover:text-sky-600 transition-colors mb-2 font-bold text-sm uppercase tracking-wider"
            >
              <ChevronLeft size={16} /> Quay lại danh sách
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Chỉnh sửa bài viết
            </h1>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="hidden md:flex items-center gap-2 bg-sky-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Lưu Thay Đổi
          </button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Tiêu đề bài viết
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-sky-500 transition-all outline-none font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-sky-500 transition-all outline-none font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Nội dung chi tiết
                </label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:border-sky-500 transition-all outline-none font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CẤU HÌNH BIÊN TẬP */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Chủ đề (Topic)
                </label>
                <select
                  value={form.topic_id}
                  onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none font-bold text-slate-700 focus:bg-white focus:border-sky-500"
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Ảnh đại diện bài viết
                </label>
                <div className="relative group aspect-video border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center hover:border-sky-400 transition-colors">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-slate-300" size={32} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Trạng thái hiển thị
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none font-bold text-slate-700 focus:bg-white"
                >
                  <option value={1}>Công khai (Hiện)</option>
                  <option value={0}>Bản nháp (Ẩn)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex md:hidden items-center justify-center gap-2 bg-sky-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-sky-100 active:scale-95 transition-transform"
            >
              {loading ? "Đang lưu..." : "Cập nhật bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}