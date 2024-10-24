import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, CircularProgress, MenuItem, Autocomplete } from '@mui/material';
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

  // Thêm hàm kiểm tra ngày trong quá khứ
  const isPastDate = (date) => {
    const orderDate = new Date(date);
    const now = new Date();
    return orderDate < now;
  };

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

    // Validate ngày đặt hàng
    if (!order.orderDate) {
      newErrors.orderDate = 'Vui lòng chọn ngày đặt hàng';
    } else if (isPastDate(order.orderDate)) {
      newErrors.orderDate = 'Không thể chọn ngày trong quá khứ';
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
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => `${option.name} - Còn ${option.quantity} sản phẩm`}
                    value={products.find(p => p.id === item.productId) || null}
                    onChange={(event, newValue) => {
                      handleItemChange(index, 'productId', newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn sản phẩm"
                        required
                        margin="normal"
                        error={!!errors[`items[${index}].productId`]}
                        helperText={errors[`items[${index}].productId`]}
                      />
                    )}
                  />
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
            <Autocomplete
              options={orderStatusOptions}
              value={order.orderStatus || ''}
              onChange={(event, newValue) => {
                handleChange({
                  target: { name: 'orderStatus', value: newValue }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trạng thái đơn hàng"
                  required
                  margin="normal"
                  error={!!errors.orderStatus}
                  helperText={errors.orderStatus}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={paymentStatusOptions}
              value={order.paymentStatus || ''}
              onChange={(event, newValue) => {
                handleChange({
                  target: { name: 'paymentStatus', value: newValue }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trạng thái thanh toán"
                  required
                  margin="normal"
                  error={!!errors.paymentStatus}
                  helperText={errors.paymentStatus}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={paymentMethodOptions}
              value={order.paymentMethod || ''}
              onChange={(event, newValue) => {
                handleChange({
                  target: { name: 'paymentMethod', value: newValue }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Phương thức thanh toán"
                  required
                  margin="normal"
                  error={!!errors.paymentMethod}
                  helperText={errors.paymentMethod}
                />
              )}
            />
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

          {/* Ngày đặt hàng */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày đặt hàng"
              name="orderDate"
              type="datetime-local"
              value={order.orderDate || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.orderDate}
              helperText={errors.orderDate}
              InputLabelProps={{
                shrink: true,
              }}
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
