export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Trang bạn đang tìm không tồn tại.</p>
        <a
          href=""
          className="px-6 py-3 bg-pink-600 rounded-lg font-semibold text-black"
        >
          Quay về trang chủ
        </a>
      </div>
  );
}
