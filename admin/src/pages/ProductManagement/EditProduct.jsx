import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, CircularProgress, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Thêm state cho hình ảnh mới
  const [errors, setErrors] = useState({});

  // Bản đồ key sang nhãn có dấu
  const cauHinhLabels = {
    kichThuocManHinh: "Kích thước màn hình",
    congNgheManHinh: "Công nghệ màn hình",
    cameraSau: "Camera sau",
    cameraTruoc: "Camera trước",
    chipset: "Chipset",
    gpu: "GPU",
    congNgheNFC: "Công nghệ NFC",
    dungLuongRAM: "Dung lượng RAM",
    boNhoTrong: "Bộ nhớ trong",
    pin: "Dung lượng pin",
    theSIM: "Thẻ SIM",
    doPhanGiaiManHinh: "Độ phân giải màn hình",
    congSac: "Cổng sạc",
    // Thêm các key khác nếu cần
  };

  // Thêm các options giống như AddProduct
  const colorOptions = ['Đen', 'Trắng', 'Vàng', 'Xanh', 'Đỏ', 'Hồng', 'Tím', 'Xám'];
  const osOptions = ['Android', 'IOS'];
  const brandOptions = ['Apple', 'Samsung', 'Oppo', 'Xiaomi', 'Vivo', 'Realme', 'Huawei', 'Nokia', 'LG', 'Lenovo', 'Asus', 'Google', 'Microsoft', 'BlackBerry', 'HTC', 'Sony', 'Motorola', 'OnePlus', 'Razer', 'ZTE', 'Meizu', 'Nubia'];
  const screenTechOptions = ['OLED', 'AMOLED', 'LCD', 'IPS LCD', 'Super AMOLED'];
  const nfcOptions = ['Có', 'Không'];
  const simOptions = ['1 SIM', '2 SIM', 'eSIM'];
  const chargingPortOptions = ['Lightning', 'Type-C', 'Micro USB'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Product data:', data); // Ghi log dữ liệu sản phẩm
          const productData = data.product; // Lấy sản phẩm từ data.product
          const cauhinh = typeof productData.cauhinh === 'string' ? JSON.parse(productData.cauhinh) : productData.cauhinh;
          setProduct({ ...productData, cauhinh }); // Đặt lại product với cauhinh đã được parse
          setImagePreview(`${BASE_URL}/${productData.image}`); // Đặt preview cho hình ảnh hiện tại
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("cauhinh.")) {
      const key = name.split(".")[1];
      setProduct({ ...product, cauhinh: { ...product.cauhinh, [key]: value } });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
    setImagePreview(URL.createObjectURL(file)); // Tạo preview cho hình ảnh mới
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Lặp qua các trường của product và thêm vào formData
    Object.keys(product).forEach((key) => {
      if (key === 'cauhinh') {
        formData.append(key, JSON.stringify(product[key])); // Chuyển cauhinh thành JSON string
      } else if (key === 'image' && product[key] instanceof File) {
        formData.append(key, product[key]); // Nếu là hình ảnh mới, thêm vào formData
      } else {
        formData.append(key, product[key]); // Các trường khác
      }
    });

    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Sản phẩm đã được cập nhật thành công');
        navigate('/product-management');
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      alert('Lỗi khi cập nhật sản phẩm: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/product-management'); // Quay lại trang quản lý sản phẩm
  };

  // Thêm hàm validate
  const validateForm = () => {
    const newErrors = {};

    // Validate tên sản phẩm
    if (!product.name || product.name.trim() === '') {
      newErrors.name = 'Vui lòng nhập tên sản phẩm';
    }

    // Validate màu sắc
    if (!product.color) {
      newErrors.color = 'Vui lòng chọn màu sắc';
    }

    // Validate số lượng
    if (product.quantity === undefined || product.quantity < 0) {
      newErrors.quantity = 'Số lượng không được âm';
    }

    // Validate giá
    if (product.price === undefined || product.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    // Validate hệ điều hành
    if (!product.os) {
      newErrors.os = 'Vui lòng chọn hệ điều hành';
    }

    // Validate thương hiệu
    if (!product.brand) {
      newErrors.brand = 'Vui lòng chọn thương hiệu';
    }

    return newErrors;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Không tìm thấy sản phẩm</Typography>;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Chỉnh sửa sản phẩm</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select
              label="Màu sắc"
              name="color"
              value={product.color || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {colorOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select
              label="Hệ điều hành"
              name="os"
              value={product.os || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {osOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select
              label="Thương hiệu"
              name="brand"
              value={product.brand || ''}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {brandOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Số lượng tồn" 
              name="quantity" 
              value={product.quantity || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              type="number" 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Giá (VNĐ)" 
              name="price" 
              value={product.price || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              type="number" 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Hình ảnh sản phẩm hiện tại" 
              name="image" 
              value={imagePreview || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Hình ảnh sản phẩm hiện tại</Typography>
            {imagePreview && <img src={imagePreview} alt="Product" style={{ maxWidth: '200px', marginBottom: '10px' }} />}
            <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Cấu hình sản phẩm</Typography>
          </Grid>
          {product.cauhinh ? (
            Object.entries(product.cauhinh).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={cauHinhLabels[key] || key} // Hiển thị label từ bản đồ, nếu không có thì dùng key
                  name={`cauhinh.${key}`}
                  value={value || ''} // Hiển thị chuỗi rỗng nếu không có giá trị
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            ))
          ) : (
            <Typography>Không có thông tin cấu hình sản phẩm</Typography> // Thông báo nếu không có cấu hình
          )}
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Cập nhật sản phẩm
          </Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary" size="large" style={{ marginLeft: 16 }}>
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProduct;
