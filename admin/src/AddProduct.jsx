import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const history = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    color: '',
    quantity: '',
    price: '',
    os: '',
    brand: '',
    description: '',
    image: null,
    cauhinh: {
      kichThuocManHinh: '',
      congNgheManHinh: '',
      cameraSau: '',
      cameraTruoc: '',
      chipset: '',
      gpu: '',
      congNgheNFC: '',
      dungLuongRAM: '',
      boNhoTrong: '',
      pin: '',
      theSIM: '',
      doPhanGiaiManHinh: '',
      congSac: '',
    }
  });
  const [productId, setProductId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Thêm state để lưu URL hình ảnh

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
    setImagePreview(URL.createObjectURL(file)); // Tạo URL tạm thời cho hình ảnh
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('color', product.color);
    formData.append('quantity', product.quantity);
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
        setProductId(result.id);
        alert('Sản phẩm đã được thêm thành công');
        history.push('/product-management'); // Chuyển hướng sau khi thêm thành công
      } else {
        const result = await response.json();
        alert('Lỗi khi thêm sản phẩm: ' + result.message);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Lỗi kết nối đến server');
    }
  };

  const handleCancel = () => {
    history.push('/product-management'); // Quay lại /product-management
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Thêm sản phẩm mới</Typography>
      {productId && <Typography>ID sản phẩm mới: {productId}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Tên sản phẩm" name="name" value={product.name} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Màu sắc" name="color" value={product.color} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Số lượng tồn" name="quantity" value={product.quantity} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Giá (VNĐ)" name="price" value={product.price} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Hệ điều hành" name="os" value={product.os} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Hãng" name="brand" value={product.brand} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Mô tả" name="description" value={product.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Hình ảnh sản phẩm</Typography>
            <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <Box mt={2}>
                <img src={imagePreview} alt="Preview" style={{ width: 325, height: 325 }} />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Cấu hình sản phẩm</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Kích thước màn hình" name="cauhinh.kichThuocManHinh" value={product.cauhinh.kichThuocManHinh} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Công nghệ màn hình" name="cauhinh.congNgheManHinh" value={product.cauhinh.congNgheManHinh} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Camera sau" name="cauhinh.cameraSau" value={product.cauhinh.cameraSau} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Camera trước" name="cauhinh.cameraTruoc" value={product.cauhinh.cameraTruoc} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Chipset" name="cauhinh.chipset" value={product.cauhinh.chipset} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="GPU" name="cauhinh.gpu" value={product.cauhinh.gpu} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Công nghệ NFC" name="cauhinh.congNgheNFC" value={product.cauhinh.congNgheNFC} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Dung lượng RAM" name="cauhinh.dungLuongRAM" value={product.cauhinh.dungLuongRAM} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Bộ nhớ trong" name="cauhinh.boNhoTrong" value={product.cauhinh.boNhoTrong} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Pin" name="cauhinh.pin" value={product.cauhinh.pin} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Thẻ SIM" name="cauhinh.theSIM" value={product.cauhinh.theSIM} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Độ phân giải màn hình" name="cauhinh.doPhanGiaiManHinh" value={product.cauhinh.doPhanGiaiManHinh} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Cổng sạc" name="cauhinh.congSac" value={product.cauhinh.congSac} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Thêm sản phẩm
          </Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary" size="large" style={{ marginLeft: 16 }}>
            Huỷ
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProduct;
