import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Clock } from 'lucide-react';
import '../styles/Dashboard.css';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

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
      return '#f44336'; // Grey
  }
};

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      users: { total: 0, change: 0 },
      orders: { total: 0, change: 0 },
      revenue: { total: 0, change: 0 },
      pendingOrders: { total: 0, change: 0 }
    },
    monthlyRevenue: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('year'); // 'year', 'week', 'day'
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/dashboard/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        let data;
        let labels;
        let values;

        switch (timeRange) {
          case 'day': {
            const dailyResponse = await fetch(`${BASE_URL}/api/dashboard/revenue/daily`);
            data = await dailyResponse.json();
            labels = data.map(item => {
              const date = new Date(item._id);
              return `${getDayOfWeek(date)} ${date.toLocaleDateString('vi-VN', { 
                day: '2-digit',
                month: '2-digit'
              })}`;
            });
            values = data.map(item => item.total / 1000000);
            break;
          }

          case 'week': {
            const weeklyResponse = await fetch(`${BASE_URL}/api/dashboard/revenue/weekly`);
            data = await weeklyResponse.json();
            labels = data.map(item => {
              const date = new Date(item.startDate);
              return `Tuần ${item._id}`;
            });
            values = data.map(item => item.total / 1000000);
            break;
          }

          default:
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            values = dashboardData.monthlyRevenue.map(item => item.total / 1000000);
            break;
        }

        setChartData({
          labels,
          datasets: [{
            label: 'Doanh số bán hàng',
            data: values,
            borderColor: '#1A1A40',
            backgroundColor: 'rgba(26, 26, 64, 0.1)',
            tension: 0.4
          }]
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [timeRange, dashboardData.monthlyRevenue]);

  if (loading || !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        ticks: {
          callback: function(value) {
            return value + 'M';
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${context.raw.toFixed(2)}M VNĐ`;
          },
        },
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'Đơn hàng mới';
      case 'Đã thanh toán':
        return 'Đã thanh toán';
      case 'Đang giao hàng':
        return 'Đang giao';
      case 'Đã giao hàng':
        return 'Đã giao';
      case 'Đã hủy':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <>
      <h3>Dashboard</h3>
      <div style={{ padding: '16px' }}>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng người dùng" 
              value={dashboardData.stats.users.total} 
              change={`${dashboardData.stats.users.change}% so với tháng trước`}
              icon={Users} 
              changeType={dashboardData.stats.users.change >= 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng đơn hàng" 
              value={dashboardData.stats.orders.total} 
              change={`${dashboardData.stats.orders.change}% so với tuần trước`}
              icon={Package} 
              changeType={dashboardData.stats.orders.change >= 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Doanh thu tháng này" 
              value={formatCurrency(dashboardData.stats.revenue.total)}
              change={`${dashboardData.stats.revenue.change}% so với tháng trước`}
              icon={DollarSign} 
              changeType={dashboardData.stats.revenue.change >= 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Đơn hàng chờ xử lý" 
              value={dashboardData.stats.pendingOrders.total}
              change={`${dashboardData.stats.pendingOrders.change}% so với hôm qua`}
              icon={Clock} 
              changeType={dashboardData.stats.pendingOrders.change >= 0 ? 'up' : 'down'} 
            />
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Doanh số bán hàng {timeRange === 'year' ? 'năm 2024' : 
                                 timeRange === 'week' ? '4 tuần gần nhất' : 
                                 '7 ngày gần nhất'}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h4" fontWeight="bold" marginRight="8px">
                  {formatCurrency(dashboardData.stats.revenue.total)}
                </Typography>
                <Typography 
                  variant="body1" 
                  color={dashboardData.stats.revenue.change >= 0 ? "success.main" : "error.main"} 
                  fontWeight="bold"
                >
                  {dashboardData.stats.revenue.change}% so với kỳ trước
                </Typography>
              </Box>
            </Box>

            <ButtonGroup variant="outlined">
              <Button 
                onClick={() => setTimeRange('day')}
                style={{ 
                  textTransform: 'none', 
                  backgroundColor: timeRange === 'day' ? '#1A1A40' : '#f5f5f5',
                  color: timeRange === 'day' ? 'white' : 'inherit'
                }}
              >
                Ngày
              </Button>
              <Button 
                onClick={() => setTimeRange('week')}
                style={{ 
                  textTransform: 'none', 
                  backgroundColor: timeRange === 'week' ? '#1A1A40' : '#f5f5f5',
                  color: timeRange === 'week' ? 'white' : 'inherit'
                }}
              >
                Tuần
              </Button>
              <Button 
                onClick={() => setTimeRange('year')}
                style={{ 
                  textTransform: 'none', 
                  backgroundColor: timeRange === 'year' ? '#1A1A40' : '#f5f5f5',
                  color: timeRange === 'year' ? 'white' : 'inherit'
                }}
              >
                Thường niên
              </Button>
            </ButtonGroup>
          </Box>
          <div style={{ height: '400px', position: 'relative' }}>
            <Line data={chartData} options={options} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Danh sách đơn hàng đã đặt gần đây
            </h3>
            <button
              onClick={() => navigate('/order-management')}
              className="btn btn-primary"
              style={{
                backgroundColor: '#1A1A40',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Xem tất cả đơn hàng
            </button>
          </div>
          
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
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {order.customerId} / {order.customerName}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {new Date(order.orderDate).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </td>
                    <td 
                      style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        color: getStatusColor(order.status)
                      }}
                    >
                      {getStatusText(order.status)}
                    </td>
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
