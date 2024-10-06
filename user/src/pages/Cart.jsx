import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [overStockError, setOverStockError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    console.log("Fetching user data for email:", userEmail);
    
    if (userEmail) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/email/${userEmail}`);
        const data = await response.json();
        
        console.log("User data response:", data);

        if (response.ok) {
          return data.id; // Return the user ID
        } else {
          throw new Error("Error fetching user ID");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data");
      }
    } else {
      setError("User email not found");
      console.error("User email not found");
    }
    return null; // Return null if user email is not found
  };

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();
      
      console.log("Fetched cart items:", data);

      if (response.ok) {
        setCartItems(data); // Set the cart items to the fetched data
      } else {
        throw new Error(data.message || "Error fetching cart items");
      }
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Error fetching cart items");
    }
  };

  useEffect(() => {
    const loadCartItems = async () => {
      const userId = await fetchUserData(); // Fetch the user ID

      if (!userId) {
        navigate('/login'); // Redirect to login if userId is not found
        return;
      }

      console.log("User ID fetched:", userId);
      await fetchCartItems(userId); // Fetch the cart items using the user ID
      setLoading(false); // Set loading to false after fetching
    };

    loadCartItems();
  }, [navigate]);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const userId = await fetchUserData(); // Fetch user ID

    try {
      await fetch(`http://localhost:5000/api/cart/${userId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update localStorage
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Update item quantity and check stock
  const updateQuantity = async (productId, newQuantity) => {
    const userId = await fetchUserData(); // Fetch user ID
    const productInCart = cartItems.find((item) => item.productId === productId);

    if (newQuantity <= 0) {
      setItemToRemove(productInCart);
      setShowConfirmDialog(true); // Show confirmation dialog
    } else {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        const data = await response.json();
        if (response.status === 400) {
          setOverStockError(data.message); // Show error if overstock
        } else {
          const updatedCartItems = cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          );
          setCartItems(updatedCartItems);
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update localStorage
          setOverStockError(null); // Clear error if updated successfully
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  // Confirm item removal
  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove.productId);
    setShowConfirmDialog(false);
  };

  // Loading state
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Giỏ hàng của bạn đang trống</h2>
        <p className="mt-4">Hãy chọn thêm sản phẩm để mua sắm nhé</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
      <div className="">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex items-center">
              <img
                src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : '/default-image.jpg'}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Tên sản phẩm: {item.name}</h3>
                <p className="text-sm font-semibold">Màu: {item.color}</p>
                <p className="text-red-500">Giá: {item.price.toLocaleString()}đ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-3 py-1 border rounded-md"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-3 py-1 border rounded-md"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show overstock error */}
      {overStockError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
          {overStockError}
        </div>
      )}

      {/* Confirmation dialog for removing item */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h3>Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?</h3>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setShowConfirmDialog(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hủy</button>
              <button onClick={handleConfirmRemove} className="bg-red-500 text-white px-4 py-2 rounded-lg">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-right">
        <p className="text-xl">
          Tạm tính:{" "}
          <span className="text-red-500 font-semibold">
            {calculateTotal().toLocaleString()}đ
          </span>
        </p>
        <button
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg"
          onClick={() => {/* Handle checkout logic */}}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
