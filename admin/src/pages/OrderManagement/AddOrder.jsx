import React, { useState, useEffect } from 'react'; 
import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [order, setOrder] = useState({
    customerId: '',
    customerName: '',
    shippingAddress: '',
    items: [{ productId: '', quantity: 1 }],
    paymentMethod: 'Cash',
    totalAmount: 0,
    status: 'Chờ xác nhận',
    orderDate: new Date().toISOString().slice(0, 16), // Set default order date to current date and time
    notes: '',
  });

  // Fetch products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data); // Initially set filtered products to all products
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch customer info when customerId changes
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (order.customerId) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${order.customerId}`);
          if (response.ok) {
            const data = await response.json();
            setOrder((prevOrder) => ({ ...prevOrder, customerName: data.name }));
          } else {
            console.error('Customer not found');
            setOrder((prevOrder) => ({ ...prevOrder, customerName: '' }));
          }
        } catch (error) {
          console.error('Error fetching customer info:', error);
        }
      } else {
        setOrder((prevOrder) => ({ ...prevOrder, customerName: '' }));
      }
    };

    fetchCustomerInfo();
  }, [order.customerId]);

  // Recalculate total whenever the items or quantities change
  useEffect(() => {
    let total = 0;
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setOrder((prevOrder) => ({
      ...prevOrder,
      totalAmount: total,
    }));
  }, [order.items, products]);

  // Format the total amount as VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  const handleAddItem = () => {
    setOrder({ ...order, items: [...order.items, { productId: '', quantity: 1 }] });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...order.items];
    updatedItems.splice(index, 1);
    setOrder({ ...order, items: updatedItems });
  };

  // Filter products based on input in the product dropdown
  const handleProductFilter = (index, value) => {
    const updatedItems = [...order.items];
    updatedItems[index]['productId'] = value;
    setOrder({ ...order, items: updatedItems });

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Submit the form and place the order
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Assuming you want to process the first product in the order.items for submission
    const selectedItem = order.items[0]; // Change index as necessary
    const product = products.find((p) => p.id === selectedItem.productId);

    if (product) {
      formData.append('name', product.name);
      formData.append('color', product.color);
      formData.append('quantity', selectedItem.quantity); // Using quantity from the item
      formData.append('price', product.price);
      formData.append('os', product.os);
      formData.append('brand', product.brand);
      formData.append('description', product.description);

      if (product.image) {
        formData.append('image', product.image);
      }

      formData.append('cauhinh', JSON.stringify(product.cauhinh));

      try {
        const response = await fetch('http://localhost:5000/api/addProduct', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setProductId(result.id); // Make sure setProductId is declared in your state
          alert('Sản phẩm đã được thêm thành công');
          navigate('/product-management');
        } else {
          const result = await response.json();
          alert('Lỗi khi thêm sản phẩm: ' + result.message);
        }
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Lỗi kết nối đến server');
      }
    } else {
      alert('Không tìm thấy sản phẩm.');
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Thêm đơn đặt hàng</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Id khách hàng"
              name="customerId"
              value={order.customerId}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên khách hàng"
              name="customerName"
              value={order.customerName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled // Disable this field to prevent manual editing
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              value={order.shippingAddress}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          {/* Order Date and Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày đặt hàng"
              name="orderDate"
              type="datetime-local"
              value={order.orderDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Sản phẩm đặt</Typography>
            {order.items.map((item, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <TextField
                    label="Sản phẩm"
                    value={item.productId}
                    onChange={(e) => handleProductFilter(index, e.target.value)} // Filter products based on input
                    fullWidth
                    required
                  />
                  <TextField
                    select
                    label="Chọn sản phẩm"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    fullWidth
                    margin="normal"
                  >
                    {filteredProducts.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                <Grid item xs={3}>
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

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Phương thức thanh toán"
              name="paymentMethod"
              value={order.paymentMethod}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
              <MenuItem value="Thẻ tín dụng">Thẻ tín dụng</MenuItem>
              <MenuItem value="Thanh toán trực tuyến">Thanh toán trực tuyến</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tổng tiền"
              name="totalAmount"
              value={formatVND(order.totalAmount)} // Format total amount as VND
              fullWidth
              margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Trạng thái đơn hàng"
              name="status"
              value={order.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
              <MenuItem value="Đang giao">Đang giao</MenuItem>
              <MenuItem value="Đã giao">Đã giao</MenuItem>
              <MenuItem value="Đã hủy">Đã hủy</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              name="notes"
              value={order.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Thêm đơn đặt hàng
          </Button>
          <Button onClick={() => navigate('/order-management')} variant="outlined" color="secondary" size="large" style={{ marginLeft: '16px' }}>
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddOrder;
