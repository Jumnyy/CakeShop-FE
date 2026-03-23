"use client";
import React, { useEffect, useState } from "react";
import ProductSaleServices from "@/services/ProductSaleService";
import { format } from "date-fns";

export default function SaleHistory({ saleId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await ProductSaleServices.getHistory(saleId);
      if (res.status) {
        setLogs(res.data);
      }
      setLoading(false);
    };
    if (saleId) fetchHistory();
  }, [saleId]);

  if (loading) return <div className="text-slate-400">Đang tải lịch sử...</div>;
  if (logs.length === 0)
    return (
      <div className="text-slate-500 italic">Chưa có lịch sử thay đổi nào.</div>
    );

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-bold text-blue-400 border-b border-slate-800 pb-2 uppercase">
        Lịch sử thay đổi khuyến mãi
      </h3>
      <div className="relative border-l border-slate-700 ml-3 space-y-8">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-8">
            {/* Icon trạng thái */}
            <span
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-slate-950 ${
                log.action === "create"
                  ? "bg-emerald-500"
                  : log.action === "update"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            ></span>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-slate-200 uppercase text-sm">
                  Hành động:{" "}
                  {log.action === "update"
                    ? "Cập nhật"
                    : log.action === "create"
                    ? "Tạo mới"
                    : "Xóa"}
                </span>
                <span className="text-xs text-slate-500">
                  {format(new Date(log.created_at), "HH:mm - dd/MM/yyyy")}
                </span>
              </div>

              {/* So sánh dữ liệu nếu là hành động Update */}
              {log.action === "update" && log.old_data && log.new_data && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-2 bg-rose-500/10 rounded border border-rose-500/20">
                    <p className="font-bold text-rose-400 mb-1 italic">
                      Dữ liệu cũ:
                    </p>
                    <p>
                      Giá:{" "}
                      <span className="text-white">
                        {Number(log.old_data.price_sale).toLocaleString()}₫
                      </span>
                    </p>
                    <p>
                      Tên:{" "}
                      <span className="text-white">{log.old_data.name}</span>
                    </p>
                    <p>
                      Trạng thái:{" "}
                      <span className="text-white">
                        {log.old_data.status === 1 ? "Bật" : "Tắt"}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <p className="font-bold text-emerald-400 mb-1 italic">
                      Dữ liệu mới:
                    </p>
                    <p>
                      Giá:{" "}
                      <span className="text-white">
                        {Number(log.new_data.price_sale).toLocaleString()}₫
                      </span>
                    </p>
                    <p>
                      Tên:{" "}
                      <span className="text-white">{log.new_data.name}</span>
                    </p>
                    <p>
                      Trạng thái:{" "}
                      <span className="text-white">
                        {log.new_data.status === 1 ? "Bật" : "Tắt"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {log.action === "create" && (
                <p className="text-xs text-slate-400">
                  Đã khởi tạo bản ghi khuyến mãi với giá:{" "}
                  <b className="text-white">
                    {Number(log.new_data.price_sale).toLocaleString()}₫
                  </b>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
