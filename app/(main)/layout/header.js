"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CategoryService from "@/services/CategoryService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State cho dropdown user
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getList({ limit: 999, page: 1 });
        setCategories(res.data || []);
      } catch (error) {
        console.error("Lỗi load category", error);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;

  const categoryTree = categories
    .filter((cat) => !cat.parent_id)
    .map((parent) => ({
      ...parent,
      children: categories.filter((child) => child.parent_id === parent.id),
    }));

  return (
    <header className="relative z-50 w-full shadow-md bg-white">
      {/* ===== HEADER MAIN ===== */}
      <div className="px-6 md:px-16 py-4 flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/bg.jpg"
            alt="Logo"
            width={100}
            height={50}
            priority
          />
        </Link>

        {/* ===== NAV + MEGA MENU ===== */}
        <nav className="hidden lg:flex items-center space-x-8 flex-1 uppercase text-sm font-semibold">
          <Link href="/about" className="hover:text-red-600">
            Giới thiệu
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 text-red-600 py-4">
              Sản phẩm <ChevronDown size={14} />
            </button>
            <div className="absolute left-0 top-full w-[600px] bg-white shadow-xl border-t-2 border-amber-500 rounded-b-md opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 p-6">
              <div className="grid grid-cols-3 gap-6">
                {categoryTree.map((parent) => (
                  <div key={parent.id}>
                    <Link
                      href={`/category/${parent.slug}`}
                      className="font-bold text-gray-900 text-sm mb-2 block hover:text-amber-600 border-b pb-1"
                    >
                      {parent.name}
                    </Link>
                    <ul className="space-y-1 mt-2 normal-case">
                      {parent.children?.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/category/${child.slug}`}
                            className="text-gray-600 text-xs hover:text-amber-500 transition block py-1 font-medium"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/post" className="hover:text-red-600">
            Tin tức
          </Link>
          <Link href="/sale" className="hover:text-red-600">
            Sale
          </Link>
        </nav>

        {/* ===== RIGHT ACTIONS ===== */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-60 border focus-within:border-red-500 transition">
            <input
              type="text"
              placeholder="Tìm bánh..."
              className="bg-transparent outline-none text-sm w-full"
            />
            <Search
              size={18}
              className="text-gray-500 hover:text-red-600 cursor-pointer"
            />
          </div>

          <Heart size={20} className="cursor-pointer hover:text-red-500" />

          <Link href="/cart" className="relative group">
            <ShoppingBag
              size={20}
              className="group-hover:text-red-600 transition"
            />
          </Link>

          {/* LOGIN / USER DROPDOWN */}
          {!user ? (
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-sm font-bold uppercase text-gray-700 hover:text-red-600 transition"
            >
              Đăng nhập
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-red-600 transition uppercase"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <UserIcon size={18} />
                </div>
                <span className="hidden md:block truncate max-w-[100px]">
                  {user.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* Dropdown Menu */}
              {/* Dropdown Menu - Đã lược bỏ animate-in để tránh lỗi plugin */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 z-[100]">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Tài khoản
                    </p>
                    {/* Thêm dấu ? để tránh lỗi undefined */}
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <ClipboardList size={18} />
                    <span className="font-semibold">Thông tin người dùng</span>
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <ClipboardList size={18} />
                    <span className="font-semibold">Lịch sử đơn hàng</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      router.push("/auth/signin");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50 text-left"
                  >
                    <LogOut size={18} />
                    <span className="font-bold uppercase text-xs">
                      Đăng xuất
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
