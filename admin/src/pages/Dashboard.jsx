import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Clock } from 'lucide-react';
import '../styles/Dashboard.css';
import { BASE_URL } from '../config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, change, icon: Icon, changeType }) => (
  <Card style={{ flex: 1, margin: '0 8px' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2" color={changeType === 'up' ? 'success.main' : 'error.main'}>
            {changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {change}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: 'action.hover', borderRadius: '50%', p: 1 }}>
          <Icon size={24} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'Chờ xác nhận':
      return '#FFA500'; // Orange
    case 'Đã xác nhận':
      return '#4CAF50'; // Green
    case 'Đang giao hàng':
      return '#2196F3'; // Blue
    case 'Đã giao hàng':
      return '#4CAF50'; // Green
    case 'Đã huỷ':
      return '#f44336'; // Red
    case 'Đã thanh toán':
      return '#4CAF50'; // Green
    default:
      return '#757575'; // Grey
  }
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  // Gộp tất cả useEffect vào một
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/dashboard/stats`);
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Xử lý resize chart
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading || !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [{
      label: 'Doanh số bán hàng',
      data: dashboardData?.monthlyRevenue 
        ? Array(12).fill(0).map((_, index) => {
            const monthData = dashboardData.monthlyRevenue.find(item => item._id === index + 1);
            return monthData ? monthData.total / 1000000 : 0;
          })
        : Array(12).fill(0),
      borderColor: '#1A1A40',
      backgroundColor: 'rgba(26, 26, 64, 0.1)',
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Đảm bảo chart thay đổi theo kích thước khung
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#CCCCFF',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw * 1000} sales $${tooltipItem.raw * 3000}`;
          },
        },
      },
    },
  };

  return (
    <>
      <h3>Dashboard</h3>
      <div style={{ padding: '16px' }}>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng người dùng" 
              value={dashboardData.stats.users.total.toLocaleString('vi-VN')} 
              change={`${dashboardData.stats.users.change}% so với tháng trước`}
              icon={Users} 
              changeType={dashboardData.stats.users.change > 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng đơn hàng" 
              value={dashboardData.stats.orders.total.toLocaleString('vi-VN')} 
              change={`${dashboardData.stats.orders.change}% so với tuần trước`}
              icon={Package} 
              changeType={dashboardData.stats.orders.change > 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng doanh thu" 
              value={`${(dashboardData.stats.revenue.total).toLocaleString('vi-VN')}đ`}
              change={`${dashboardData.stats.revenue.change}% so với tháng trước`}
              icon={DollarSign} 
              changeType={dashboardData.stats.revenue.change > 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Đơn hàng đang chờ" 
              value={dashboardData.stats.pendingOrders.total.toLocaleString('vi-VN')}
              change={`${dashboardData.stats.pendingOrders.change}% so với hôm qua`}
              icon={Clock} 
              changeType={dashboardData.stats.pendingOrders.change > 0 ? 'up' : 'down'} 
            />
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Doanh số bán hàng năm 2024</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h4" fontWeight="bold" marginRight="8px">$12.7k</Typography>
                <Typography variant="body1" color="green" fontWeight="bold">+1.3% so với năm trước</Typography>
              </Box>
            </Box>

            <ButtonGroup variant="outlined">
              <Button style={{ textTransform: 'none', backgroundColor: '#f5f5f5' }}>Ngày</Button>
              <Button style={{ textTransform: 'none', backgroundColor: '#f5f5f5' }}>Tuần</Button>
              <Button style={{ textTransform: 'none', backgroundColor: '#1A1A40', color: 'white' }}>Thường niên</Button>
            </ButtonGroup>
          </Box>
          <div className='dashboard-chart' style={{ height: '400px' }}> {/* Đảm bảo chart có chiều cao */}
            <Line ref={chartRef} data={chartData} options={options} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Danh sách đơn hàng đã đặt gần đây</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã đơn hàng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã / Tên khách hàng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ngày đặt</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thành tiền</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.id}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.customerId} / {order.customerName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', color: getStatusColor(order.status) }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
