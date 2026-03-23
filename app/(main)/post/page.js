"use client";
import React, { useEffect, useState, useCallback } from "react";
import PostService from "@/services/PostService";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

// 1. Danh sách các chủ đề (Bạn có thể thay đổi slug để khớp với Backend)
const CATEGORIES = [
  { id: "all", name: "Tất cả", slug: "" },
  { id: "news", name: "Tin tức", slug: "tin-tuc" },
  { id: "promotion", name: "Khuyến mãi", slug: "khuyen-mai" },
  { id: "recipe", name: "Công thức bánh", slug: "cong-thuc" },
  { id: "event", name: "Sự kiện", slug: "su-kien" },
];

export default function PostListPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("all"); // State lọc chủ đề

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const itemsPerPage = 6;

  const API_URL = "http://localhost:8000";

  // 2. Hàm fetch bài viết có tích hợp lọc topic
  const fetchPosts = useCallback(async (page, topicId) => {
    try {
      setLoading(true);
      
      // Tìm slug hoặc id tương ứng để gửi lên API
      const selectedCat = CATEGORIES.find(c => c.id === topicId);
      
      const params = {
        post_type: "post",
        status: 1,
        page: page,
        limit: itemsPerPage,
      };

      // Nếu không phải "Tất cả", thêm tham số lọc vào params
      if (topicId !== "all") {
        params.topic_id = topicId; // Hoặc params.slug = selectedCat.slug tùy Backend
      }

      const response = await PostService.getList(params);

      const resData = response?.data?.data || response?.data || [];
      const totalPages = response?.data?.last_page || 1;

      setNewsList(resData);
      setLastPage(totalPages);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài viết:", err);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // 3. Theo dõi sự thay đổi của trang và chủ đề
  useEffect(() => {
    fetchPosts(currentPage, activeTopic);
  }, [currentPage, activeTopic, fetchPosts]);

  // 4. Xử lý khi click chọn chủ đề
  const handleTopicChange = (topicId) => {
    setActiveTopic(topicId);
    setCurrentPage(1); // Reset về trang 1 khi đổi chủ đề
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-[#fcfcfc] py-24 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extralight uppercase tracking-tighter mb-6 italic">
            Journal
          </h1>
          <p className="text-[11px] text-zinc-400 tracking-[0.5em] uppercase">
            Câu chuyện về những ổ bánh ra lò mỗi ngày
          </p>
        </div>
      </div>

      {/* 5. BỘ LỌC CHỦ ĐỀ (Minimalist Style) */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-16">
        <div className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto pb-4 no-scrollbar border-b border-zinc-50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTopicChange(cat.id)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all duration-300 pb-2 border-b-2 ${
                activeTopic === cat.id
                  ? "text-black border-black"
                  : "text-zinc-300 border-transparent hover:text-zinc-500"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading && newsList.length === 0 ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
          </div>
        ) : newsList.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 transition-opacity duration-500 ${loading ? "opacity-30" : "opacity-100"}`}>
              {newsList.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/post/${item.id}`}
                  className="group block animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 mb-8 rounded-[2rem]">
                    <img
                      src={`${API_URL}/storage/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                       <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                         {CATEGORIES.find(c => c.id === activeTopic)?.name || "Baking"}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        {new Date(item.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="h-[1px] w-6 bg-zinc-100"></span>
                    </div>

                    <h3 className="text-xl font-light tracking-tight group-hover:text-amber-900 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-light italic">
                      {item.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 group-hover:border-zinc-300 transition-colors">
                        Read Story
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PHÂN TRANG */}
            {lastPage > 1 && (
              <div className="mt-24 flex justify-center items-center gap-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center border border-zinc-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-4">
                  {[...Array(lastPage)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`text-[11px] font-black transition-colors ${
                          currentPage === pageNum ? "text-black border-b-2 border-black" : "text-zinc-300 hover:text-zinc-600"
                        }`}
                      >
                        {pageNum.toString().padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="w-12 h-12 flex items-center justify-center border border-zinc-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">Không có câu chuyện nào trong mục này</p>
          </div>
        )}
      </section>
    </main>
  );
}