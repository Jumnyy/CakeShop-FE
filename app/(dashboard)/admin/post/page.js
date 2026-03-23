"use client";
import { useEffect, useState } from "react";
import PostService from "@/services/PostService";
import Link from "next/link";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Cấu hình URL backend của bạn
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await PostService.getList({
          limit,
          page,
          search,
        });

        // Tùy vào cấu trúc API của bạn (thường Laravel phân trang trả về res.data.data)
        const data = res.data?.data || res.data || [];
        const lastPage = res.data?.last_page || 1;

        setPosts(data);
        setTotalPages(lastPage);
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const deleteItem = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      const res = await PostService.delete(id);
      if (res.data?.status || res.status) {
        alert("Xóa bài viết thành công!");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Lỗi xóa bài viết!");
      console.error(err);
    }
  };

  // Hàm phụ để loại bỏ tag HTML khi hiển thị tóm tắt nội dung
  const stripHtml = (html) => {
    if (!html) return "Chưa có nội dung";
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm px-6 py-5 mb-6 flex justify-between items-center border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📝</span> Quản lý bài viết
        </h2>

        <Link
          href="/admin/post/add"
          className="px-6 py-2.5 rounded-xl text-white font-medium bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <span>➕</span> Thêm bài viết
        </Link>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value={5}>5 bài / trang</option>
            <option value={10}>10 bài / trang</option>
            <option value={20}>20 bài / trang</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Tiêu đề
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nội dung
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 animate-pulse"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      {post.id}
                    </td>

                    <td className="px-6 py-4">
                      {post.image ? (
                        <img
                          src={`${API_URL}/storage/${post.image}`}
                          alt={post.title}
                          className="w-20 h-12 object-cover rounded-lg border border-gray-100 shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/200x120?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-400 italic">
                        /{post.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-[200px]">
                        {stripHtml(post.content)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          post.post_type === "post"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        {post.post_type === "post" ? "Bài viết" : "Trang"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          post.status === 1 ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === 1 ? "bg-green-600" : "bg-gray-400"
                          }`}
                        ></span>
                        {post.status === 1 ? "Hiển thị" : "Đang ẩn"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/post/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => deleteItem(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
          >
            上
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                  page === i + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
          >
            下
          </button>
        </nav>
      </div>
    </div>
  );
}
