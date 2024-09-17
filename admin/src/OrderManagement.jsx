import React, { useState } from 'react';
import { Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, MenuItem, Menu, IconButton } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'; // Icons cho dropdown

const ordersData = [
  { id: 'OD001', customerId: 'KH001', productId: 'SP001', dayOrder: '10/08/2024' ,quantity: 2, totalAmount: 202123,status: 'Giao thành công' },
  { id: 'OD002', customerId: 'KH002', productId: 'SP002', dayOrder: '12/09/2024' ,quantity: 1, totalAmount: 7911239,status: 'Đã bị huỷ' },
  { id: 'OD003', customerId: 'KH003', productId: 'SP003', dayOrder: '17/08/2024' ,quantity: 3, totalAmount: 360000,status: 'Chờ xác nhận' },
];

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);  // Cho menu trạng thái đơn hàng

  const [orders, setOrders] = useState(ordersData); // Quản lý danh sách đơn đặt hàng

  // Toggle mở/đóng dropdown trạng thái đơn hàng
  const handleStatusDropdownClick = (event) => {
    setStatusAnchorEl(statusAnchorEl ? null : event.currentTarget);
  };

  // Xử lý chọn trạng thái đơn hàng
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event);
    setStatusAnchorEl(null);  // Đóng menu sau khi chọn
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  // Xử lý xóa đơn đặt hàng
  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Xử lý thêm đơn đặt hàng mới
  const handleAddOrder = () => {
    const newOrder = {
      id: `OD00${orders.length + 1}`,
      customerId: 'KH004',
      productId: 'SP001',
      dayOrder: new Date().toLocaleDateString('vi-VN'),
      quantity: 1,
      totalAmount: 999,
      status: 'Pending',
    };
    setOrders([...orders, newOrder]);
  };

  // Xử lý chỉnh sửa trạng thái đơn đặt hàng (đơn giản là thay đổi trạng thái)
  const handleEditOrder = (orderId) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: 'Delivered' } : order
    );
    setOrders(updatedOrders);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearchTerm = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customerId.includes(searchTerm) || order.productId.includes(searchTerm);
    const matchesStatusFilter = statusFilter === '' || order.status === statusFilter;

    return matchesSearchTerm && matchesStatusFilter;
  });

  return (
    <>
    <h3>Quản lý đơn đặt hàng</h3>
        <Box padding={3}>
      {/* Thanh tìm kiếm */}
      <TextField label="Tìm kiếm đơn đặt hàng" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} margin="normal" />

      {/* Bộ lọc trạng thái đơn hàng */}
      <Box display="flex" gap={2} marginBottom={2}>
        {/* Dropdown trạng thái */}
        <Box>
          <IconButton onClick={handleStatusDropdownClick} aria-controls={statusAnchorEl ? 'status-menu' : undefined}>
            Trạng thái đơn hàng {statusAnchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
          <Menu
            id="status-menu"
            anchorEl={statusAnchorEl}
            open={Boolean(statusAnchorEl)}
            onClose={() => setStatusAnchorEl(null)}
          >
            <MenuItem onClick={() => handleStatusFilterChange('')}>Tất cả</MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange('Giao thành công')}>Giao thành công</MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange('Chờ xác nhận')}>Chờ xác nhận</MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange('Đã bị huỷ')}>Đã huỷ</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Nút thêm đơn đặt hàng */}
      <Box marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleAddOrder}>Thêm đơn đặt hàng</Button>
      </Box>

      {/* Danh sách đơn đặt hàng */}
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Mã khách hàng</TableCell>
              <TableCell>Mã sản phẩm</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Số lượng đặt</TableCell>
              <TableCell>Thành tiền (VNĐ)</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Chi tiết</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerId}</TableCell>
                <TableCell>{order.productId}</TableCell>
                <TableCell>{order.dayOrder}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell> {/* Định dạng thành tiền VNĐ */}
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleViewDetails(order)}>
                    Xem chi tiết
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditOrder(order.id)} style={{ marginRight: '8px' }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteOrder(order.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      {/* Dialog Chi tiết đơn đặt hàng */}
      {selectedOrder && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết đơn đặt hàng</DialogTitle>
          <DialogContent>
            <Typography>Mã đơn hàng: {selectedOrder.id}</Typography>
            <Typography>Mã khách hàng: {selectedOrder.customerId}</Typography>
            <Typography>Mã sản phẩm: {selectedOrder.productId}</Typography>
            <Typography>Ngày đặt: {selectedOrder.dayOrder}</Typography>
            <Typography>Số lượng đặt: {selectedOrder.quantity}</Typography>
            <Typography>Thành tiền: {selectedOrder.totalAmount} VNĐ</Typography>
            <Typography>Trạng thái: {selectedOrder.status}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
    </>
  );
};

export default OrderManagement;
