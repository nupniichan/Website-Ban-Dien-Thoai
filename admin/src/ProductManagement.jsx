import React, { useState } from 'react';
import { Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, MenuItem, Menu, IconButton } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'; // Icons cho dropdown

const productsData = [
  { id: 'SP001', name: 'iPhone 13', color: 'Black', quantity: 10, price: 999, os: 'iOS', brand: 'Apple', description: 'Màn hình 6.1 inch, chip A15 Bionic...' },
  { id: 'SP002', name: 'Samsung Galaxy S21', color: 'White', quantity: 15, price: 799, os: 'Android', brand: 'Samsung', description: 'Màn hình 6.2 inch, chip Exynos 2100...' },
  { id: 'SP003', name: 'MacBook Air M1', color: 'Silver', quantity: 8, price: 1200, os: 'macOS', brand: 'Apple', description: 'Chip M1, RAM 8GB, SSD 256GB...' },
  // Thêm nhiều sản phẩm khác...
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [osFilter, setOsFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [osAnchorEl, setOsAnchorEl] = useState(null);  // Cho menu hệ điều hành
  const [brandAnchorEl, setBrandAnchorEl] = useState(null);  // Cho menu hãng

  const [products, setProducts] = useState(productsData); // Quản lý danh sách sản phẩm

  // Toggle mở/đóng dropdown hệ điều hành
  const handleOsDropdownClick = (event) => {
    setOsAnchorEl(osAnchorEl ? null : event.currentTarget);
  };

  // Toggle mở/đóng dropdown hãng
  const handleBrandDropdownClick = (event) => {
    setBrandAnchorEl(brandAnchorEl ? null : event.currentTarget);
  };

  // Xử lý chọn hệ điều hành
  const handleOsFilterChange = (event) => {
    setOsFilter(event);
    setOsAnchorEl(null);  // Đóng menu sau khi chọn
  };

  // Xử lý chọn hãng
  const handleBrandFilterChange = (event) => {
    setBrandFilter(event);
    setBrandAnchorEl(null);  // Đóng menu sau khi chọn
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  // Xử lý thêm sản phẩm mới
  const handleAddProduct = () => {
    const newProduct = {
      id: `SP00${products.length + 1}`,
      name: 'New Product',
      color: 'Black',
      quantity: 10,
      price: 1000,
      os: 'iOS',
      brand: 'Apple',
      description: 'Mô tả sản phẩm mới...'
    };
    setProducts([...products, newProduct]);
  };

  // Xử lý chỉnh sửa sản phẩm (đơn giản là thay đổi tên)
  const handleEditProduct = (productId) => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, name: product.name + ' (Updated)' } : product
    );
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.includes(searchTerm);
    const matchesOsFilter = osFilter === '' || product.os === osFilter;
    const matchesBrandFilter = brandFilter === '' || product.brand === brandFilter;

    return matchesSearchTerm && matchesOsFilter && matchesBrandFilter;
  });

  return (
    <>
    <h3>Quản lý sản phẩm</h3>
        <Box padding={3}>
      {/* Thanh tìm kiếm */}
      <TextField label="Tìm kiếm sản phẩm" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} margin="normal" />

      {/* Bộ lọc sản phẩm */}
      <Box display="flex" gap={2} marginBottom={2}>
        {/* Dropdown hệ điều hành */}
        <Box>
          <IconButton onClick={handleOsDropdownClick} aria-controls={osAnchorEl ? 'os-menu' : undefined}>
            Hệ điều hành {osAnchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
          <Menu
            id="os-menu"
            anchorEl={osAnchorEl}
            open={Boolean(osAnchorEl)}
            onClose={() => setOsAnchorEl(null)}
          >
            <MenuItem onClick={() => handleOsFilterChange('')}>Tất cả</MenuItem>
            <MenuItem onClick={() => handleOsFilterChange('iOS')}>iOS</MenuItem>
            <MenuItem onClick={() => handleOsFilterChange('Android')}>Android</MenuItem>
            <MenuItem onClick={() => handleOsFilterChange('macOS')}>macOS</MenuItem>
          </Menu>
        </Box>

        {/* Dropdown hãng */}
        <Box>
          <IconButton onClick={handleBrandDropdownClick} aria-controls={brandAnchorEl ? 'brand-menu' : undefined}>
            Hãng {brandAnchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
          <Menu
            id="brand-menu"
            anchorEl={brandAnchorEl}
            open={Boolean(brandAnchorEl)}
            onClose={() => setBrandAnchorEl(null)}
          >
            <MenuItem onClick={() => handleBrandFilterChange('')}>Tất cả</MenuItem>
            <MenuItem onClick={() => handleBrandFilterChange('Apple')}>Apple</MenuItem>
            <MenuItem onClick={() => handleBrandFilterChange('Samsung')}>Samsung</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Nút thêm sản phẩm */}
      <Box marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>Thêm sản phẩm</Button>
      </Box>

      {/* Danh sách sản phẩm */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Màu</TableCell>
            <TableCell>Số lượng tồn</TableCell>
            <TableCell>Giá (VNĐ)</TableCell>
            <TableCell>Chi tiết</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.color}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleViewDetails(product)}>
                  Xem chi tiết
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleEditProduct(product.id)} style={{ marginRight: '8px' }}>
                  Sửa
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product.id)}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Chi tiết sản phẩm */}
      {selectedProduct && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>Mã sản phẩm: {selectedProduct.id}</Typography>
            <Typography>Tên sản phẩm: {selectedProduct.name}</Typography>
            <Typography>Màu: {selectedProduct.color}</Typography>
            <Typography>Số lượng: {selectedProduct.quantity}</Typography>
            <Typography>Đơn giá: {selectedProduct.price} VNĐ</Typography>
            <Typography>Mô tả: {selectedProduct.description}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
    </>
  );
};

export default ProductManagement;
