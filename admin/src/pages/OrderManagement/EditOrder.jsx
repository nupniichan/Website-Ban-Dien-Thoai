import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, Grid, MenuItem, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Fetch products and order details
  useEffect(() => {
    const fetchOrderAndProducts = async () => {
      try {
        // Fetch the order by ID
        const orderResponse = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const productsResponse = await fetch('http://localhost:5000/api/products');
        if (orderResponse.ok && productsResponse.ok) {
          const orderData = await orderResponse.json();
          const productsData = await productsResponse.json();
          setOrder(orderData);
          setProducts(productsData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProducts();
  }, [orderId]);

  // Calculate the total amount based on the items and their quantities
  useEffect(() => {
    if (order) {
      let total = 0;
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      });
      setOrder((prevOrder) => ({ ...prevOrder, totalAmount: total }));
    }
  }, [order?.items, products]);

  // Handle form input changes
  const handleInputChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        alert('Order updated successfully');
        navigate('/order-management');
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Format date and time to 'YYYY-MM-DDTHH:mm' for datetime-local input
  const formatDateTime = (date) => {
    const d = new Date(date);
    const formattedDate = d.toISOString().slice(0, 16); // Extract YYYY-MM-DDTHH:mm
    return formattedDate;
  };

  if (loading) return <CircularProgress />;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Chỉnh sửa đơn hàng</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên khách hàng"
              name="customerName"
              value={order.customerName}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              value={order.shippingAddress}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          {/* Order Date and Time Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày đặt hàng"
              name="orderDate"
              type="datetime-local"
              value={formatDateTime(order.orderDate)}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensure the label stays above the input when prefilled
              }}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Sản phẩm được đặt</Typography>
            {order.items.map((item, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Product"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    fullWidth
                    required
                  >
                    {products.map((product) => (
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
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginTop: '10px' }}>
              Add Item
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Phương thức thanh toán"
              name="paymentMethod"
              value={order.paymentMethod}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
              <MenuItem value="MoMo">Momo</MenuItem>
              <MenuItem value="VNPay">VNPay</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tổng tiền"
              name="totalAmount"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
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
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
              <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
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
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Cập nhật đơn đặt hàng
          </Button>
          <Button onClick={() => navigate('/order-management')} variant="outlined" color="secondary" size="large" style={{ marginLeft: '16px' }}>
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditOrder;
