import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, CircularProgress, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);

  // Options cho các dropdown
  const orderStatusOptions = ['Đang xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng', 'Đã huỷ'];
  const paymentStatusOptions = ['Chưa thanh toán', 'Đã thanh toán', 'Thanh toán lỗi'];
  const paymentMethodOptions = ['Tiền mặt', 'Thẻ tín dụng', 'Thanh toán trực tuyến', 'Chuyển khoản ngân hàng'];

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          throw new Error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrder();
    fetchProducts();
  }, [orderId]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate customer info
    if (!order.customerId) {
      newErrors.customerId = 'Vui lòng nhập ID khách hàng';
    }

    if (!order.customerName) {
      newErrors.customerName = 'Vui lòng nhập tên khách hàng';
    }

    if (!order.shippingAddress) {
      newErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
    }

    // Validate items
    if (!order.items || order.items.length === 0) {
      newErrors.items = 'Đơn hàng phải có ít nhất một sản phẩm';
    } else {
      order.items.forEach((item, index) => {
        if (!item.productId) {
          newErrors[`items[${index}].productId`] = 'Vui lòng chọn sản phẩm';
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`items[${index}].quantity`] = 'Số lượng phải lớn hơn 0';
        }
      });
    }

    // Validate payment and status
    if (!order.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    if (!order.orderStatus) {
      newErrors.orderStatus = 'Vui lòng chọn trạng thái đơn hàng';
    }

    if (!order.paymentStatus) {
      newErrors.paymentStatus = 'Vui lòng chọn trạng thái thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder(prev => ({
      ...prev,
      items: updatedItems
    }));
    // Clear error for this item field
    if (errors[`items[${index}].${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`items[${index}].${field}`]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        alert('Đơn hàng đã được cập nhật thành công');
        navigate('/order-management');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Lỗi khi cập nhật đơn hàng: ' + error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Chỉnh sửa đơn hàng</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Customer Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID Khách hàng"
              name="customerId"
              value={order.customerId || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.customerId}
              helperText={errors.customerId}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên khách hàng"
              name="customerName"
              value={order.customerName || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.customerName}
              helperText={errors.customerName}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              value={order.shippingAddress || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.shippingAddress}
              helperText={errors.shippingAddress}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Sản phẩm</Typography>
            {order.items && order.items.map((item, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Sản phẩm"
                    value={item.productId || ''}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    fullWidth
                    required
                    error={!!errors[`items[${index}].productId`]}
                    helperText={errors[`items[${index}].productId`]}
                    margin="normal"
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Số lượng"
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    fullWidth
                    required
                    error={!!errors[`items[${index}].quantity`]}
                    helperText={errors[`items[${index}].quantity`]}
                    margin="normal"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Order Status and Payment */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Trạng thái đơn hàng"
              name="orderStatus"
              value={order.orderStatus || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.orderStatus}
              helperText={errors.orderStatus}
              margin="normal"
            >
              {orderStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Trạng thái thanh toán"
              name="paymentStatus"
              value={order.paymentStatus || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.paymentStatus}
              helperText={errors.paymentStatus}
              margin="normal"
            >
              {paymentStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Phương thức thanh toán"
              name="paymentMethod"
              value={order.paymentMethod || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.paymentMethod}
              helperText={errors.paymentMethod}
              margin="normal"
            >
              {paymentMethodOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              name="notes"
              value={order.notes || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Cập nhật đơn hàng
          </Button>
          <Button 
            onClick={() => navigate('/order-management')} 
            variant="outlined" 
            color="secondary" 
            size="large" 
            style={{ marginLeft: 16 }}
          >
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditOrder;
