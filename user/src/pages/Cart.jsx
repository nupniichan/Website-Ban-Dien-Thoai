import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [overStockError, setOverStockError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lưu vào session tạm thời tại cái login chưa làm xong
    sessionStorage.setItem('userId', 'KH010');

    const fetchCartItems = async () => {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        console.error('Xin hãy đăng nhập để sử dụng tính năng này');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/cart/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCartItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  // Tính tổng giá tiền
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    const userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage

    try {
      await fetch(`${BASE_URL}/api/cart/${userId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng và kiểm tra tồn kho
  const updateQuantity = async (productId, newQuantity) => {
    const userId = sessionStorage.getItem('userId');
    const productInCart = cartItems.find((item) => item.productId === productId);

    if (newQuantity <= 0) {
      setItemToRemove(productInCart);
      setShowConfirmDialog(true); // Hiển thị hộp thoại xác nhận xóa sản phẩm
    } else {
      try {
        const response = await fetch(`${BASE_URL}/api/cart/${userId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        const data = await response.json();
        if (response.status === 400) {
          setOverStockError(data.message); // Hiển thị lỗi nếu vượt quá tồn kho
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
          );
          setOverStockError(null); // Xóa lỗi nếu cập nhật thành công
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
      }
    }
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove.productId);
    setShowConfirmDialog(false);
  };

  // Giao diện khi giỏ hàng trống
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
          className="mt-6 bg-blue-400 text-white px-6 py-2 rounded-lg"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
      <div className="grid grid-cols-1 gap-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex items-center">
              <img
                src={item.image ? `${BASE_URL}/${item.image.replace(/\\/g, '/')}` : '/default-image.jpg'}
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hiển thị thông báo lỗi vượt quá tồn kho */}
      {overStockError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
          {overStockError}
        </div>
      )}

      {/* Hiển thị hộp thoại xác nhận xóa sản phẩm */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h3>Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?</h3>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setShowConfirmDialog(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hủy</button>
              <button onClick={handleConfirmRemove} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Xác nhận</button>
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
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
        onClick={() => navigate('/checkout', { state: { cartItems, total: calculateTotal() } })}
        >
        Mua ngay ({cartItems.length})
        </button>
      </div>
    </div>
  );
};

export default Cart;   