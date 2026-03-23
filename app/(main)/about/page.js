"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="bg-white text-[#333] font-sans">
      
      {/* ================= HERO ================= */}
      <div className="relative h-[420px]">
        <img
          src="/images/banner.jpg"
          alt="Fresh Garden Bakery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-light uppercase tracking-widest mb-4">
              Fresh Garden
            </h1>
            <p className="text-sm uppercase tracking-[0.3em]">
              Bánh tươi – Trọn vẹn yêu thương
            </p>
          </div>
        </div>
      </div>

      {/* ================= STORY ================= */}
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-light uppercase tracking-[0.3em] mb-10">
          Câu chuyện của chúng tôi
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6">
          <strong>Fresh Garden</strong> được tạo nên từ niềm đam mê với bánh ngọt
          và mong muốn mang đến những chiếc bánh tươi ngon, tinh tế cho mọi
          khoảnh khắc trong cuộc sống.
        </p>

        <p className="text-gray-600 leading-relaxed">
          Chúng tôi tin rằng mỗi chiếc bánh không chỉ là món ăn, mà còn là
          <strong> sự kết nối cảm xúc</strong> – là lời chúc mừng, là yêu thương,
          là niềm vui sẻ chia bên gia đình và bạn bè.
        </p>
      </div>

      {/* ================= VALUES ================= */}
      <div className="bg-[#f8f8f8] py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
          
          <div>
            <h3 className="text-lg uppercase tracking-widest mb-4">
              Nguyên liệu tươi
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Chúng tôi lựa chọn nguyên liệu chất lượng cao, an toàn,
              không chất bảo quản, đảm bảo hương vị tự nhiên và tươi mới mỗi ngày.
            </p>
          </div>

          <div>
            <h3 className="text-lg uppercase tracking-widest mb-4">
              Làm bánh mỗi ngày
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bánh được sản xuất trong ngày bởi đội ngũ thợ bánh lành nghề,
              giữ trọn độ mềm – thơm – ngon cho từng sản phẩm.
            </p>
          </div>

          <div>
            <h3 className="text-lg uppercase tracking-widest mb-4">
              Phục vụ tận tâm
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fresh Garden luôn đặt trải nghiệm khách hàng lên hàng đầu,
              từ tư vấn, đặt bánh cho đến giao hàng nhanh chóng.
            </p>
          </div>

        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-3xl font-light uppercase tracking-[0.3em] mb-6">
              Sản phẩm của chúng tôi
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Fresh Garden mang đến đa dạng các dòng bánh:
            </p>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside">
              <li>Bánh kem sinh nhật – bánh sự kiện</li>
              <li>Bánh mì & bánh ngọt hằng ngày</li>
              <li>Bánh theo mùa & quà tặng</li>
              <li>Thiết kế bánh theo yêu cầu</li>
            </ul>
          </div>

          <div className="h-[300px]">
            <img
              src="/images/post.jpg"
              alt="Fresh Garden Cakes"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="bg-black text-white py-20 text-center">
        <h2 className="text-3xl font-light uppercase tracking-[0.3em] mb-6">
          Trải nghiệm hương vị ngọt ngào
        </h2>
        <p className="text-gray-300 text-sm mb-8">
          Hãy để Fresh Garden đồng hành cùng những khoảnh khắc đặc biệt của bạn
        </p>
        <Link
          href="/products"
          className="inline-block border border-white px-10 py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black transition"
        >
          Xem sản phẩm
        </Link>
      </div>

    </section>
  );
}
