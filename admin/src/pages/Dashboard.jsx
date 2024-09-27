import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Clock } from 'lucide-react';
import '../styles/Dashboard.css';

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

const Dashboard = () => {
  const chartRef = useRef(null); // Tham chiếu đến chart

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Doanh số bán hàng',
        data: [1.2, 1.5, 1.8, 2.0, 2.5, 3.2, 2.9, 3.3, 2.8, 3.0, 3.5, 4.2],
        borderColor: 'rgba(143, 153, 251, 1)',
        backgroundColor: 'rgba(143, 153, 251, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'white',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(143, 153, 251, 1)',
      },
    ],
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

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.chartInstance.resize(); // Gọi hàm resize
      }
    };

    window.addEventListener('resize', handleResize); // Lắng nghe sự kiện resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup khi component bị unmount
    };
  }, []);

  return (
    <>
      <h3>Dashboard</h3>
      <div style={{ padding: '16px' }}>
        <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-3">
          <StatCard title="Tổng người dùng" value="40,689" change=" 8.5% so với tháng trước" icon={Users} changeType="up" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <StatCard title="Tổng đơn hàng" value="10,293" change=" 1.3% so với tuần trước" icon={Package} changeType="up" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <StatCard title="Tổng doanh số bán" value="$89,000" change=" 4.3% so với tuần trước" icon={DollarSign} changeType="down" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <StatCard title="Đơn hàng đang chờ" value="2,040" change=" 1.8% so với ngày hôm qua" icon={Clock} changeType="up" />
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
            <Line ref={chartRef} data={data} options={options} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Danh sách đơn hàng đã đặt gần đây</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã đơn hàng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên sản phẩm</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã / Tên khách hàng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ngày đặt</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Số lượng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thành tiền</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>IP16X2024-1</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Iphone 16</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1 / nupniichan</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>16/09/2024 - 12:53 PM</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>$9.999</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', color: 'green' }}>Đã được giao</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>IP16X2024-2</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Iphone 16</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1 / nupniichan</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>16/09/2024 - 12:53 PM</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>$9.999</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', color: 'orange' }}>Chờ xác nhận</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>IP16X2024-3</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>Iphone 16</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1 / nupniichan</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>16/09/2024 - 12:53 PM</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>$9.999</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', color: 'red' }}>Chưa được giao</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;