"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MenuService from "@/services/MenuService";
import Link from "next/link";
import {
  Save,
  ChevronLeft,
  LayoutGrid,
  Link2,
  Settings,
  Loader2,
  Tag,
} from "lucide-react";

export default function EditMenu() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    link: "",
    position: "mainmenu",
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // LOAD MENU DETAIL
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await MenuService.getById(id);
        // Kiểm tra cấu trúc data từ API của bạn (thường là res.data hoặc res.data.data)
        const menu = res.data?.data || res.data;

        if (menu) {
          setForm({
            name: menu.name || "",
            link: menu.link || "",
            position: menu.position || "mainmenu",
            status: menu.status ?? 1,
          });
        }
      } catch (err) {
        console.error(err);
        alert("❌ Không tải được dữ liệu menu");
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        link: form.link,
        position: form.position,
        status: Number(form.status),
      };

      await MenuService.update(id, payload);
      alert("✅ Cập nhật menu thành công");
      router.push("/admin/menu");
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật menu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Đang tải thông tin Menu...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 lg:p-10 animate-in fade-in duration-500">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors font-bold text-sm uppercase mb-2"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Sửa Menu: <span className="text-teal-600">#{id}</span>
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Lưu Thay Đổi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* MAIN FORM CARD */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Tag size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Nội dung Menu
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Tên nhãn hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:bg-white focus:border-teal-500 transition-all font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Đường dẫn liên kết
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Link2 size={18} />
                  </div>
                  <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 p-4 outline-none focus:bg-white focus:border-teal-500 transition-all font-medium text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Settings size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Cấu hình hiển thị
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Vị trí Menu
                </label>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, position: "mainmenu" })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                      form.position === "mainmenu"
                        ? "bg-white text-teal-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    MAIN MENU
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, position: "footermenu" })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                      form.position === "footermenu"
                        ? "bg-white text-teal-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    FOOTER
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">
                  Trạng thái hoạt động
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-slate-700 focus:bg-white focus:border-teal-500 transition-all appearance-none"
                >
                  <option value={1}>✅ Đang hiển thị</option>
                  <option value={0}>❌ Tạm ẩn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* HELPER TEXT */}
        <div className="bg-teal-50 p-6 rounded-[24px] border border-teal-100">
          <p className="text-[11px] text-teal-600 font-bold uppercase tracking-wider leading-relaxed text-center">
            Mẹo: Khi thay đổi đường dẫn (Link), hãy chắc chắn rằng bạn đã cập
            nhật lại các trang liên quan để tránh lỗi truy cập.
          </p>
        </div>
      </div>
    </div>
  );
}
