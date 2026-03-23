"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Chart from "chart.js/auto";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Loader2,
  RefreshCcw,
  ArrowUpRight,
  Target,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

// Services của bạn
import OrderService from "@/services/OrderService";
import ProductService from "@/services/ProductService";
import UserService from "@/services/UserService";

export default function AdminDashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm bóc tách dữ liệu từ API
  const extractData = (res) => {
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data; // Laravel Paginate
    if (res?.data && Array.isArray(res.data)) return res.data; // Axios thường
    if (Array.isArray(res)) return res; // Interceptor đã bóc sẵn
    return [];
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Gọi cả 3 bảng: Đơn hàng, Sản phẩm, User
      const [orderRes, productRes, userRes] = await Promise.all([
        OrderService.getList({ limit: 1000 }),
        ProductService.getList({ limit: 1000 }),
        UserService.getList({ limit: 1000 }),
      ]);

      const allOrders = extractData(orderRes);
      const allProducts = extractData(productRes);
      const allUsers = extractData(userRes);

      // --- LOGIC TÍNH DOANH THU QUAN TRỌNG NHẤT ---
      // Lấy giá của từng order cộng dồn lại
      const totalRevenue = allOrders.reduce((acc, order) => {
        // Chỉ cộng nếu đơn hàng KHÔNG ở trạng thái Hủy (giả sử 4 là hủy)
        if (Number(order.status) !== 4) {
          // Lấy giá tiền từ cột của bạn (thường là total_money hoặc total)
          const orderPrice = Number(order.total_money || order.total || 0);
          return acc + orderPrice;
        }
        return acc;
      }, 0);

      // Đếm đơn hàng mới trong tháng này
      const now = new Date();
      const newOrdersCount = allOrders.filter((o) => {
        const d = new Date(o.created_at);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length;

      // Cập nhật các ô số liệu (KPI)
      setStats([
        {
          title: "Tổng doanh thu",
          value:
            totalRevenue >= 1000000
              ? `${(totalRevenue / 1000000).toFixed(1)}M`
              : `${totalRevenue.toLocaleString()}đ`,
          icon: <DollarSign size={20} />,
          color: "text-primary",
          bg: "bg-primary-subtle",
          trend: "Live",
        },
        {
          title: "Đơn hàng tháng này",
          value: newOrdersCount,
          icon: <ShoppingBag size={20} />,
          color: "text-success",
          bg: "bg-success-subtle",
          trend: "Đơn mới",
        },
        {
          title: "Sản phẩm",
          value: allProducts.length,
          icon: <TrendingUp size={20} />,
          color: "text-warning",
          bg: "bg-warning-subtle",
          trend: "Kho",
        },
        {
          title: "Người dùng",
          value: allUsers.length,
          icon: <Users size={20} />,
          color: "text-info",
          bg: "bg-info-subtle",
          trend: "Thành viên",
        },
      ]);

      // Xử lý dữ liệu biểu đồ 6 tháng
      const months = [];
      const revenues = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(`T${d.getMonth() + 1}`);

        const monthlySum = allOrders.reduce((sum, o) => {
          const oDate = new Date(o.created_at);
          const isMatch =
            oDate.getMonth() === d.getMonth() &&
            oDate.getFullYear() === d.getFullYear();
          return isMatch && Number(o.status) !== 4
            ? sum + Number(o.total_money || o.total || 0)
            : sum;
        }, 0);
        revenues.push(monthlySum / 1000000); // Chuyển sang đơn vị Triệu
      }
      setChartData({ labels: months, values: revenues });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchData();
  }, [fetchData, mounted]);

  // Vẽ biểu đồ (Chart.js)
  useEffect(() => {
    if (loading || !chartRef.current || !mounted) return;
    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Doanh thu",
            data: chartData.values,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: (v) => v + "M" } } },
      },
    });
  }, [loading, chartData, mounted]);

  if (!mounted) return null;
  if (loading)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Loader2 size={48} className="text-primary spin-icon mb-3" />
        <p className="fw-bold text-secondary">ĐANG KẾT NỐI DATABASE...</p>
      </div>
    );

  return (
    <div className="admin-dashboard-wrapper min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold text-dark m-0">Báo Cáo Kinh Doanh</h2>
          <button
            onClick={fetchData}
            className="btn btn-white shadow-sm border px-4 py-2 fw-bold"
          >
            <RefreshCcw size={16} className="me-2" /> Làm mới
          </button>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                <div className="d-flex justify-content-between mb-3">
                  <div className={`p-3 rounded-3 ${s.bg} ${s.color}`}>
                    {s.icon}
                  </div>
                  <div className="text-success small fw-bold">
                    {s.trend} <ArrowUpRight size={14} />
                  </div>
                </div>
                <h6 className="text-muted small fw-bold">{s.title}</h6>
                <h3 className="fw-bold m-0">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4">
              <h5 className="fw-bold mb-4">Biểu đồ doanh thu (Triệu VNĐ)</h5>
              <div style={{ height: "350px" }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 bg-dark text-white p-4 rounded-4 h-100 shadow-lg">
              <div className="d-flex align-items-center gap-2 mb-4">
                <Target className="text-warning" />
                <h5 className="m-0 fw-bold">Mục tiêu quý</h5>
              </div>
              <p className="text-white-50 small mb-auto">
                Tổng số tiền từ đơn hàng thành công đang được cộng dồn theo thời
                gian thực.
              </p>
              <div className="my-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small">HOÀN THÀNH</span>
                  <span>75%</span>
                </div>
                <div
                  className="progress bg-secondary"
                  style={{ height: "8px" }}
                >
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <button className="btn btn-primary fw-bold py-3 rounded-3 w-100">
                Xuất báo cáo CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
