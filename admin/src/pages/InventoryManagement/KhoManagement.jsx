import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

const KhoManagement = () => {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/kho`);
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        } else {
          console.error('Failed to fetch entries:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching entries:', error.message || error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message || error);
      }
    };

    fetchEntries();
    fetchProducts();
  }, []);

  const handleViewDetails = async (entryId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kho/${entryId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEntry(data);
      } else {
        console.error('Failed to fetch entry details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching entry details:', error.message || error);
    }
  };

  const handleCloseDialog = () => {
    setSelectedEntry(null);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kho/${entryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== entryId));
      } else {
        console.error('Failed to delete entry:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting entry:', error.message || error);
    }
  };

  const handleEditEntry = (entryId) => {
    navigate(`/edit-kho/${entryId}`);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesType = typeFilter ? entry.type === typeFilter : true;
    const matchesDate = dateFilter ? entry.date.split('T')[0] === dateFilter : true;
    return matchesType && matchesDate;
  });

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Quản lý phiếu xuất nhập kho</Typography>

      <Box marginBottom={2} display="flex" alignItems="center">
        <TextField
          select
          label="Loại phiếu"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          variant="outlined"
          style={{ marginRight: '1rem', minWidth: '120px' }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Xuất">Xuất</MenuItem>
          <MenuItem value="Nhập">Nhập</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Ngày"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          variant="outlined"
          style={{ minWidth: '150px' }}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={() => navigate('/add-inout')}>
        Thêm phiếu
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Phiếu</TableCell>
              <TableCell>Tên người quản lý</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mã kho</TableCell>
              <TableCell>Loại phiếu</TableCell>
              <TableCell>Ngày xuất</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.map((entry) => (
              entry.products.map(product => (
                <TableRow key={`${entry.id}-${product.productId}`}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.managementPerson}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{entry.warehouseCode}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.date.split('T')[0]}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleViewDetails(entry.id)}>Xem</Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteEntry(entry.id)}>Xóa</Button>
                    <Button variant="outlined" color="primary" onClick={() => handleEditEntry(entry.id)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedEntry && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết phiếu</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Số phiếu: {selectedEntry.id}</Typography>
            <Typography>Tên người quản lý: {selectedEntry.managerName}</Typography>
            <Typography>Tên người xuất: {selectedEntry.employeeName}</Typography>
            <Typography>Ngày: {selectedEntry.date.split('T')[0]}</Typography>
            <Typography>Mã kho: {selectedEntry.warehouseCode}</Typography>
            <Typography>Địa điểm: {selectedEntry.location}</Typography>

            <Typography variant="h6" marginTop={2}>Danh sách sản phẩm</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Mã sản phẩm</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Màu sắc</TableCell>
                    <TableCell>Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEntry.products.map((product, index) => {
                    const productDetails = products.find(p => p.id === product.productId) || {};
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{productDetails.id || product.productId}</TableCell>
                        <TableCell>{productDetails.name || product.productName}</TableCell>
                        <TableCell>{productDetails.color || product.color}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" marginTop={2}>Ghi chú:</Typography>
            <Typography>{selectedEntry.notes}</Typography>

            <Box marginTop={2}>
              <Typography>Nhân viên xuất hàng: {selectedEntry.employeeName}</Typography>
              <Typography>Nhân viên quản lý kho: {selectedEntry.managerName}</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default KhoManagement;
