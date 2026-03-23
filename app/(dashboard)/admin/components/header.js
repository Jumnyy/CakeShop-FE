"use client";
import { Search, Bell, User } from "lucide-react";

export const Header = ({ userData }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">
              {userData?.name || "Administrator"}
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
              Quản trị viên
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};