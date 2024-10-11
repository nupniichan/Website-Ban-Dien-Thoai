import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Homepage.css';
import {BASE_URL} from '../config.js'

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10); // Số lượng sản phẩm hiển thị mặc định
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetchUserIdByEmail(userEmail).then(userId => {
        if (userId) {
          fetchUserCart(userId);
        }
      });
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        throw new Error(data.message || 'Error fetching products');
      }
    } catch (err) {
      setError('Lỗi khi lấy sản phẩm.');
      console.error('Error fetching products:', err);
    }
  };

  const fetchUserIdByEmail = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/email/${email}`);
      const data = await response.json();
      console.log(data)
      return response.ok ? data.id : null;
    } catch (err) {
      setError("Lỗi khi lấy ID người dùng.");
      console.error("Error fetching user ID by email:", err);
      return null;
    }
  };

  const filteredProducts = products.filter(product => product.quantity > 0);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
  };

  const remainingProducts = filteredProducts.length - visibleProducts;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="main">
      <h1>Home</h1>
      <div className="product-list">
        {filteredProducts.slice(0, visibleProducts).map(product => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <img
              src={`${BASE_URL}/${product.image}`}
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
