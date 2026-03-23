"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostService from "@/services/PostService";
import Link from "next/link";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const res = await PostService.getById(id);
        const postData = res.data?.post || res.data?.data || res.data;

        if (postData) {
          setPost(postData);
          const relatedRes = await PostService.getList({
            limit: 4,
            post_type: "post",
          });
          const allRelated = relatedRes?.data?.data || relatedRes?.data || [];
          setRelatedPosts(
            allRelated.filter((item) => item.id !== postData.id).slice(0, 3)
          );
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPostData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-2 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 uppercase tracking-widest">
        Không tìm thấy bài viết
      </div>
    );

  return (
    <main className="bg-white min-h-screen selection:bg-red-100 selection:text-red-900">
      {/* 1. HERO SECTION: Tiêu đề cực lớn và sang trọng */}
      <section className="pt-20 pb-12 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          {post.topic?.name || "Tin tức nổi bật"}
        </div>
        <h1 className="text-4xl md:text-6xl font-serif italic text-gray-900 leading-tight mb-8">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 uppercase tracking-widest">
          <span>By Cake Shop Admin</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
        </div>
      </section>

      {/* 2. MAIN IMAGE: Tràn viền nhẹ, bo góc và đổ bóng mờ */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
          <img
            src={`${API_URL}/storage/${post.image}`}
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
            onError={(e) => {
              e.target.src = "https://placehold.co/1200x600?text=Premium+Post";
            }}
          />
        </div>
      </div>

      {/* 3. ARTICLE CONTENT: Bố cục cột hẹp để dễ đọc (Typography Focus) */}
      <article className="max-w-3xl mx-auto px-4">
        <div
          className="rich-text-content text-gray-800 leading-[1.8] text-lg font-light
          first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-red-600
          prose prose-stone prose-img:rounded-2xl prose-headings:font-serif prose-a:text-red-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Nút chia sẻ hoặc Back */}
        <div className="mt-16 py-8 border-t border-b border-gray-50 flex justify-between items-center">
          <Link
            href="/post"
            className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition"
          >
            ← Quay lại
          </Link>
          <div className="flex gap-4">
            <span className="text-xs text-gray-400 uppercase tracking-tighter">
              Share:
            </span>
            <button className="text-xs hover:text-blue-600 transition">
              FB
            </button>
            <button className="text-xs hover:text-blue-400 transition">
              TW
            </button>
          </div>
        </div>
      </article>

      {/* 4. RELATED POSTS: Giao diện thẻ Card bo tròn hiện đại */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 mt-24 py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-center font-serif text-3xl italic mb-16 text-gray-900">
              Có thể bạn sẽ thích
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/post/${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`${API_URL}/storage/${item.image}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-3">
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    <h4 className="text-lg font-medium leading-snug group-hover:text-red-600 transition line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
