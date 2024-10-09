import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'; // Import CSS cho Homepage

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(10); // Số lượng sản phẩm hiển thị mặc định
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy tất cả sản phẩm
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data); // Lưu toàn bộ danh sách sản phẩm vào state
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      });
  }, []);

  // Lọc các sản phẩm có số lượng lớn hơn 0
  const filteredProducts = products.filter(product => product.quantity > 0);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10); // Tăng số lượng sản phẩm hiển thị thêm 10
  };

  const remainingProducts = filteredProducts.length - visibleProducts;

  // Điều hướng đến trang chi tiết sản phẩm khi nhấn vào sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <main className="main">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-list">
        {filteredProducts.slice(0, visibleProducts).map(product => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">
              Giá: <span>{product.price.toLocaleString()} VND</span>
            </p>
            <button className="buy-button">Mua ngay</button>
          </div>
        ))}
      </div>

      {remainingProducts > 0 && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={loadMoreProducts}>
            Xem thêm {remainingProducts} sản phẩm
          </button>
        </div>
      )}
    </main>
  );
};

export default Homepage;
