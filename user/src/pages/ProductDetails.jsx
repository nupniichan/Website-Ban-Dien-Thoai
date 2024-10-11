import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css'; // Tạo và import file CSS riêng cho trang chi tiết
import { BASE_URL } from '../config';

const ProductDetails = () => {
  const { productId } = useParams(); // Lấy productId từ URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(''); // Trạng thái để lưu thông báo lỗi
  const userId = sessionStorage.getItem('userId') // Tui chờ có session mới lấy full được

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của sản phẩm
    fetch(`${BASE_URL}/api/products/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      });
  }, [productId]);

  // Xử lý thay đổi số lượng sản phẩm muốn mua
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // Kiểm tra nếu số lượng vượt quá hàng tồn kho
    if (value > product.quantity) {
      setError('Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này');
    } else {
      setError(''); // Xóa thông báo lỗi nếu số lượng hợp lệ
    }

    setQuantity(value);
  };

  const handleBuyNow = () => {
    if (quantity <= product.quantity) {
      // Gọi API thêm vào giỏ hàng
      fetch(`${BASE_URL}/api/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          color: product.color, 
          quantity: quantity,
          image: product.image,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(data.message);
          } else {
            alert('Đã thêm sản phẩm vào giỏ hàng');
          }
        })
        .catch(error => {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
          alert('Đã xảy ra lỗi, vui lòng thử lại sau');
        });
    } else {
      alert('Số lượng vượt quá hàng tồn kho!');
    }
  };  

  if (!product) {
    return <div>Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="product-details">
      <img src={`${BASE_URL}/${product.image}`} alt={product.name} className="product-image" />
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>Giá: {product.price.toLocaleString()} VND</p>
        <p>Mô tả: {product.description}</p>
        <p>Trạng thái: {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</p>

        {product.quantity > 0 && (
          <div className="purchase-options">
            <label htmlFor="quantity">Số lượng: </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button className="buy-button" onClick={handleBuyNow}>
              Thêm vào giỏ hàng
            </button>
          </div>
        )}

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;