"use client";
import Link from "next/link";

export const NavItem = ({ item, isActive, pathname }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
            : "hover:bg-slate-800 hover:text-slate-100 text-slate-300"
        }`}
    >
      <Icon
        size={19}
        className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
      />
      <span className="text-sm font-semibold">{item.label}</span>
    </Link>
  );
};