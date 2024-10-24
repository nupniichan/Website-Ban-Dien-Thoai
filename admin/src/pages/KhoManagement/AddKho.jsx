import { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

const AddKho = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [kho, setKho] = useState({
    id: `PH${Date.now()}`,
    type: 'nhập',
    managementPerson: '',
    responsiblePerson: '',
    date: new Date().toISOString().slice(0, 16),
    warehouseCode: '',
    location: '',
    products: [{ productId: '', productName: '', quantity: 1, color: '' }],
    notes: '',
    warehouseType: 'Kho chính',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKho({ ...kho, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...kho.products];
    updatedItems[index][field] = value;
    setKho({ ...kho, products: updatedItems });
  };

  const handleAddItem = () => {
    setKho({ ...kho, products: [...kho.products, { productId: '', productName: '', quantity: 1, color: '' }] });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...kho.products];
    updatedItems.splice(index, 1);
    setKho({ ...kho, products: updatedItems });
  };

  const handleProductFilter = (index, value) => {
    const selectedProduct = products.find(product => product.name === value);
    const updatedItems = [...kho.products];

    if (selectedProduct) {
      updatedItems[index]['productId'] = selectedProduct.id;
      updatedItems[index]['color'] = selectedProduct.color; // Set color based on the selected product
    } else {
      updatedItems[index]['productId'] = '';
      updatedItems[index]['color'] = '';
    }

    updatedItems[index]['productName'] = value; // Keep the selected product name
    setKho({ ...kho, products: updatedItems });

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/kho`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kho),
      });

      if (response.ok) {
        alert('Phiếu đã được tạo thành công');
        navigate('/kho-management');
      } else {
        alert('Failed to create phiếu');
      }
    } catch (error) {
      console.error('Error creating phiếu:', error);
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Thêm phiếu xuất kho</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quản lý"
              name="managementPerson"
              value={kho.managementPerson}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Người chịu trách nhiệm"
              name="responsiblePerson"
              value={kho.responsiblePerson}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mã kho"
              name="warehouseCode"
              value={kho.warehouseCode}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Địa điểm"
              name="location"
              value={kho.location}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
  <Typography variant="h6" gutterBottom>Sản phẩm trong phiếu</Typography>
  {kho.products.map((item, index) => (
    <Grid container spacing={2} key={index} alignItems="center">
      <Grid item xs={4}>
        <TextField
          select
          label="Chọn sản phẩm"
          value={item.productName || ""}
          onChange={(e) => handleProductFilter(index, e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {filteredProducts.map((product) => (
            <MenuItem key={product.id} value={product.name}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="ID"
          value={item.productId}
          fullWidth
          required
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Màu sắc"
          value={item.color}
          fullWidth
          required
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Số lượng"
          type="number"
          value={item.quantity}
          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          fullWidth
          required
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(index)}>
          Xoá
        </Button>
      </Grid>
    </Grid>
  ))}
            <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginTop: '10px' }}>
              Thêm sản phẩm
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              name="notes"
              value={kho.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Loại phiếu"
              name="type"
              value={kho.type}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Nhập">Nhập</MenuItem>
              <MenuItem value="Xuất">Xuất</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ngày"
              name="date"
              type="datetime-local"
              value={kho.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Thêm phiếu
          </Button>
          <Button onClick={() => navigate('/kho-management')} variant="outlined" color="secondary" size="large" style={{ marginLeft: '16px' }}>
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddKho;
