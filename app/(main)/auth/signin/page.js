"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import * as authService from "@/services/AuthService";
import CartService from "@/services/CartService";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams("");
  // Lấy tham số redirect từ URL, mặc định là "/" nếu không có
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Gọi API đăng nhập từ authService
      const data = await authService.login(username, password);

      // 2. Cập nhật trạng thái vào Context toàn App
      if (data.user) {
        login(data.user);
      }

      // Lưu token vào localStorage (thường authService đã làm, nhưng làm lại cho chắc chắn)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 3. THỰC HIỆN MERGE CART NGAY LẬP TỨC
      // Sau khi có token, đẩy hàng từ LocalStorage lên Database
      try {
        await CartService.mergeCart();
      } catch (cartErr) {
        console.error("Lỗi đồng bộ giỏ hàng:", cartErr);
        // Không chặn quá trình đăng nhập nếu merge giỏ hàng lỗi
      }

      alert("Đăng nhập thành công!");

      // 4. ĐIỀU HƯỚNG DỰA TRÊN ROLE HOẶC THAM SỐ REDIRECT
      const role = String(data.role || data.user?.role || "").toLowerCase();

      if (role === "admin") {
        router.push("/admin");
      } else {
        // Nếu có tham số redirect (ví dụ /cart), ưu tiên quay lại đó
        router.push(redirectTo);
      }

      // Làm mới để Header cập nhật trạng thái mới
      router.refresh();
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      setError(err?.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-black py-8 px-4 text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              WELCOME BACK
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Đăng nhập để tiếp tục trải nghiệm
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                  {error}
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 ml-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Nhập username hoặc email..."
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl h-12 px-4 focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all duration-200"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between mb-1 ml-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Mật khẩu
                  </label>
                  <Link
                    href="/forgot-password"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-black transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl h-12 px-4 focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all duration-200 shadow-lg shadow-gray-200 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    ĐANG XỬ LÝ...
                  </span>
                ) : (
                  "ĐĂNG NHẬP NGAY"
                )}
              </button>

              {/* Footer Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/auth/register"
                    className="font-bold text-black hover:underline decoration-2 underline-offset-4"
                  >
                    Tạo tài khoản mới
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Support Text */}
        <p className="text-center text-gray-400 text-xs mt-8 uppercase tracking-widest">
          &copy; 2024 Your Brand Name
        </p>
      </div>
    </div>
  );
}
