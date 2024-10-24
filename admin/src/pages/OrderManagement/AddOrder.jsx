import React, { useState, useEffect } from 'react'; 
import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

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

  // Thêm state cho errors
  const [errors, setErrors] = useState({});

  // Thêm hàm validate
  const validateForm = () => {
    const newErrors = {};

    // Validate thông tin khách hàng
    if (!order.customerId?.trim()) {
      newErrors.customerId = 'Vui lòng nhập ID khách hàng';
    }

    if (!order.customerName?.trim()) {
      newErrors.customerName = 'Không tìm thấy thông tin khách hàng';
    }

    if (!order.shippingAddress?.trim()) {
      newErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
    }

    // Validate sản phẩm
    if (!order.items || order.items.length === 0) {
      newErrors.items = 'Vui lòng thêm ít nhất một sản phẩm';
    } else {
      order.items.forEach((item, index) => {
        if (!item.productId) {
          newErrors[`items.${index}.productId`] = 'Vui lòng chọn sản phẩm';
        }
        
        if (!item.quantity || item.quantity < 1) {
          newErrors[`items.${index}.quantity`] = 'Số lượng phải lớn hơn 0';
        }

        // Kiểm tra số lượng tồn kho
        const product = products.find(p => p.id === item.productId);
        if (product && item.quantity > product.quantity) {
          newErrors[`items.${index}.quantity`] = `Chỉ còn ${product.quantity} sản phẩm trong kho`;
        }
      });
    }

    // Validate phương thức thanh toán
    if (!order.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
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
          const response = await fetch(`${BASE_URL}/api/users/${order.customerId}`);
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
    setOrder(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder(prev => ({ ...prev, items: updatedItems }));
    // Xóa lỗi khi người dùng thay đổi giá trị
    if (errors[`items.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`items.${index}.${field}`]: undefined }));
    }
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
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        alert('Đơn hàng đã được tạo thành công');
        navigate('/order-management');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      alert(error.message || 'Đã xảy ra lỗi khi tạo đơn hàng');
    }
  };

  const orderStatusOptions = ['Đang xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng', 'Đã huỷ'];
  const paymentStatusOptions = ['Chưa thanh toán', 'Đã thanh toán', 'Thanh toán lỗi'];
  const paymentMethodOptions = ['Tiền mặt', 'Thẻ tín dụng', 'Thanh toán trực tuyến', 'Chuyển khoản ngân hàng'];

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
              error={!!errors.customerId}
              helperText={errors.customerId}
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
              disabled
              error={!!errors.customerName}
              helperText={errors.customerName}
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
              error={!!errors.shippingAddress}
              helperText={errors.shippingAddress}
              multiline
              rows={2}
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
                    select
                    label="Chọn sản phẩm"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors[`items.${index}.productId`]}
                    helperText={errors[`items.${index}.productId`]}
                  >
                    {filteredProducts.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - Còn {product.quantity} sản phẩm
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Số lượng"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                    error={!!errors[`items.${index}.quantity`]}
                    helperText={errors[`items.${index}.quantity`]}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleRemoveItem(index)}
                    disabled={order.items.length === 1}
                  >
                    Xoá
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddItem} 
              style={{ marginTop: '10px' }}
            >
              Thêm sản phẩm
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Trạng thái đơn hàng"
              name="orderStatus"
              value={order.orderStatus}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {orderStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Trạng thái thanh toán"
              name="paymentStatus"
              value={order.paymentStatus}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {paymentStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Phương thức thanh toán"
              name="paymentMethod"
              value={order.paymentMethod}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.paymentMethod}
              helperText={errors.paymentMethod}
            >
              {paymentMethodOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
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
