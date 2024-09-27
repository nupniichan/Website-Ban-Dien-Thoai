import { useState, useEffect } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched products:', data); // Log the products
          setProducts(data);
        } else {
          console.error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.includes(searchTerm)
  );

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Quản lý sản phẩm</Typography>

      <TextField
        label="Tìm kiếm sản phẩm"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />

      <Box marginY={2}>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>Thêm sản phẩm</Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã SP</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá (VNĐ)</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(product)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditProduct(product.id)} color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedProduct && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>Mã sản phẩm: {selectedProduct.id}</Typography>
            <Typography>Tên sản phẩm: {selectedProduct.name}</Typography>
            <Typography>Màu: {selectedProduct.color}</Typography>
            <Typography>Số lượng: {selectedProduct.quantity}</Typography>
            <Typography>Đơn giá: {formatPrice(selectedProduct.price)}</Typography>
            <Typography>Mô tả: {selectedProduct.description}</Typography>
            <Box marginTop={2}>
            <img
              src={`http://localhost:5000/${selectedProduct.image.replace(/\\/g, '/')}`}
              alt={selectedProduct.name}
              style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
            />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ProductManagement;
