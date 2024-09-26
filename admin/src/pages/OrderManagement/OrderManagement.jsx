import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, IconButton, Button, TextField } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
        alert('Order deleted successfully');
      } else {
        console.error('Failed to delete order');
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const handleEditOrderStatus = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  const handleAddOrder = () => {
    navigate('/add-order');
  };

  // Function to determine color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return { color: 'orange' };
      case 'Đã xác nhận':
      case 'Đã giao':
        return { color: 'green' };
      case 'Đã hủy':
        return { color: 'red' };
      default:
        return {};
    }
  };

  // Filter orders based on the search query (Order ID or Customer Name)
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Quản lý đơn hàng</Typography>

      {/* Search Bar */}
      <TextField
        label="Nhập mã order hoặc tên khách hàng"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      {/* Add Order Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddOrder}
        style={{ marginBottom: '20px' }}
      >
        Thêm đơn đặt hàng
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Địa chỉ giao hàng</TableCell>
              <TableCell>Ngày đặt hàng</TableCell>
              <TableCell>Phương thức thanh toán</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                {/* Format date as dd/MM/yyyy */}
                <TableCell>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</TableCell>
                <TableCell style={getStatusColor(order.status)}>{order.status}</TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="space-between">
                    <IconButton onClick={() => handleViewDetails(order)} color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleEditOrderStatus(order.id)} color="secondary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOrder(order.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedOrder && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography>Order ID: {selectedOrder.id}</Typography>
            <Typography>Khách hàng: {selectedOrder.customerName}</Typography>
            <Typography>Địa chỉ giao hàng: {selectedOrder.shippingAddress}</Typography>
            <Typography>Ngày đặt: {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}</Typography>
            <Typography>Phương thức thanh toán: {selectedOrder.paymentMethod}</Typography>
            <Typography>Trạng thái: {selectedOrder.status}</Typography>
            <Typography>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalAmount)}</Typography>
            <Typography>Ghi chú: {selectedOrder.notes}</Typography>
            <Typography>Sản phẩm đặt:</Typography>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item.productId}>
                  ID sản phẩm: {item.productId} - Số lượng: {item.quantity}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default OrderManagement;
