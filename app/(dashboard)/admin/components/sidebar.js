"use client";
import { Package, LogOut } from "lucide-react";
import { NavItem } from "./navitem";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = ({ menuItems }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 fixed h-full flex flex-col z-50">
      <div className="h-20 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Package size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Cake Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {menuItems.map((group, idx) => (
          <div key={idx} className="mb-6">
            <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href} 
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200"
        >
          <LogOut size={19} />
          <span className="text-sm font-bold">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};