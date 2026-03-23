import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3a3a3a] text-gray-200 mt-20">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* LOGO + DESC */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Cake Shop
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            Bánh tươi mỗi ngày – làm từ nguyên liệu chọn lọc, 
            mang đến hương vị ngọt ngào cho mọi khoảnh khắc.
          </p>
        </div>

        {/* ABOUT */}
        <div>
          <h4 className="text-white font-semibold mb-4 uppercase">
            Về chúng tôi
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-pink-400">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/stores" className="hover:text-pink-400">
                Hệ thống cửa hàng
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-pink-400">
                Tin tức
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-4 uppercase">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/product" className="hover:text-pink-400">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-pink-400">
                Giỏ hàng
              </Link>
            </li>
            <li>
              <Link href="/policy" className="hover:text-pink-400">
                Chính sách & điều khoản
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-4 uppercase">
            Liên hệ
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📍 123 Đường Bánh, TP.HCM</li>
            <li>📞 0917 667 531</li>
            <li>✉️ nguyentanthien@gmail.com</li>
          </ul>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-4 text-sm">
            <Link href="#" className="hover:text-pink-400">
              Facebook
            </Link>
            <Link href="#" className="hover:text-pink-400">
              Instagram
            </Link>
            <Link href="#" className="hover:text-pink-400">
              TikTok
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-600 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Cake Shop. All rights reserved.
      </div>
    </footer>
  );
}
