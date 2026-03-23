"use client";
import "../../globals.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  Package,
  ShoppingCart,
  Percent,
  ImageIcon,
  FileText,
  FolderTree,
  MenuSquare,
  Users,
  Phone,
  Settings,
} from "lucide-react";

// Import sub-components
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";

const menuItems = [
  {
    group: "Chính",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Cửa hàng",
    items: [
      { href: "/admin/category", label: "Danh mục", icon: Tags },
      { href: "/admin/product", label: "Sản phẩm", icon: Package },
      { href: "/admin/product_store", label: "Kho hàng", icon: Package },
      { href: "/admin/order", label: "Đơn hàng", icon: ShoppingCart },
    ],
  },
  {
    group: "Tiếp thị",
    items: [
      { href: "/admin/productsale", label: "Khuyến mãi", icon: Percent },
      { href: "/admin/banner", label: "Banner", icon: ImageIcon },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { href: "/admin/post", label: "Bài viết", icon: FileText },
      { href: "/admin/topic", label: "Chủ đề", icon: FolderTree },
      { href: "/admin/menu", label: "Menu", icon: MenuSquare },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      { href: "/admin/user", label: "Người dùng", icon: Users },
      { href: "/admin/contact", label: "Liên hệ", icon: Phone },
      { href: "/admin/setting", label: "Cài đặt", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.roles !== "admin") {
        alert("Bạn không có quyền truy cập!");
        router.push("/");
      } else {
        setUserData(user);
        setIsAuthorized(true);
      }
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  // Nếu chưa check quyền xong, trả về cấu trúc HTML cơ bản để tránh lỗi Next.js
  if (!isAuthorized) {
    return (
      <html lang="vi">
        <body className="bg-[#f8fafc] flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
        </body>
      </html>
    );
  }

  return (
    <html lang="vi">
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <div className="flex min-h-screen bg-[#f8fafc]">
          <Sidebar menuItems={menuItems} />

          <div className="flex-1 ml-72 flex flex-col min-h-screen">
            <Header userData={userData} />

            <main className="flex-1 p-6 bg-[#f8fafc]">{children}</main>

            <footer className="py-6 px-8 text-center text-[13px] font-medium text-slate-400 border-t bg-white">
              © 2026{" "}
              <span className="text-indigo-600 font-bold">Cake Shop</span> •
              Dashboard Management System
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
