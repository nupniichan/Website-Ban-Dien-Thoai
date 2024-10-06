import React, { useState, useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        throw new Error(data.message || 'Error fetching products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    }
  };

  const fetchUserCart = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setCartItems(data);
      } else {
        throw new Error(data.message || 'Error fetching cart items');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart items:', err);
    }
  };

  const addToCart = async (product) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error("User not logged in.");
      return;
    }

    const userId = await fetchUserIdByEmail(userEmail);
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    const { id, name, price, color, image } = product;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id, name, price, color, quantity: 1, image }),
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.cart);
        setFlyingItem(product.id); // Set the flying item ID for animation
        setTimeout(() => setFlyingItem(null), 1000); // Clear flying item after animation
      } else {
        throw new Error(data.message || 'Error adding product to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error("User not logged in.");
      return;
    }

    const userId = await fetchUserIdByEmail(userEmail);
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.cart);
      } else {
        throw new Error(data.message || 'Error removing product from cart');
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const fetchUserIdByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/email/${email}`);
      const data = await response.json();
      return response.ok ? data.id : null;
    } catch (err) {
      console.error("Error fetching user ID by email:", err);
      return null;
    }
  };

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="main">
      <h1>Home</h1>
      <div className="grid">
        {products.map((product) => {
          const inCart = cartItems.some(item => item.productId === product.id);
          return (
            <div key={product.id} className={`border rounded-lg p-4 ${flyingItem === product.id ? 'fly' : ''}`}>
              <img
                src={product.image ? `http://localhost:5000/${product.image.replace(/\\/g, '/')}` : '/default-image.jpg'}
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">Màu: {product.color}</p>
              <p className="text-red-500">Giá: {product.price.toLocaleString()}đ</p>
              {!inCart ? (
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Thêm vào giỏ hàng
                </button>
              ) : (
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Xóa khỏi giỏ hàng
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Homepage;
