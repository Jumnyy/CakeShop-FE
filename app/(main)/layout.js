import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fresh Garden Bakery | Bánh tươi mỗi ngày",
  description: "Cửa hàng bánh ngọt và dessert cao cấp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}
      >
        <AuthProvider>
          {/* Header nên cố định hoặc nằm trên cùng */}
          <Header />

          {/* Xóa 'container mx-auto' ở đây để các trang như Home (có Banner tràn viền) 
              không bị bóp nhỏ lại. 
          */}
          <main>{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
