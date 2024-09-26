import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
  const navigate = useNavigate();
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

    const updatedOrder = { ...order };

    try {
      // Send the order data to the server
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        // Update stock after order creation
        for (const item of updatedOrder.items) {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            const updatedProductQuantity = product.quantity - item.quantity;
            await fetch(`http://localhost:5000/api/products/${item.productId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ quantity: updatedProductQuantity }),
            });
          }
        }

        alert('Order created successfully');
        navigate('/order-management');
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Thêm đơn đặt hàng</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer ID"
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
              label="Customer Name"
              name="customerName"
              value={order.customerName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Shipping Address"
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
              label="Order Date"
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
                    label="Product"
                    value={item.productId}
                    onChange={(e) => handleProductFilter(index, e.target.value)} // Filter products based on input
                    fullWidth
                    required
                  />
                  <TextField
                    select
                    label="Select Product"
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
                    label="Quantity"
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
              label="Payment Method"
              name="paymentMethod"
              value={order.paymentMethod}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Cash">Tiền mặt</MenuItem>
              <MenuItem value="Credit Card">Thẻ tín dụng</MenuItem>
              <MenuItem value="Online Payment">Thanh toán trực tuyến</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Amount"
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
              label="Order Status"
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
              label="Notes"
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
