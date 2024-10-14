import React, { useState, useEffect } from 'react';

const Checkout = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [shippingOption, setShippingOption] = useState('store');
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán qua MOMO');
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notes, setNotes] = useState(''); // Lưu trữ ghi chú từ người dùng

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer info');
        }
        const data = await response.json();
        setCustomerInfo({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCartItems(data);

        const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (userId) {
      fetchCustomerInfo();
      fetchCartItems();
    } else {
      console.error('No userId found in sessionStorage');
    }
  }, [userId]);

  const handleContinue = async () => {
    const orderData = {
      customerId: userId,
      customerName: customerInfo.name,
      shippingAddress: customerInfo.address,
      items: cartItems,
      paymentMethod: paymentMethod,
      totalAmount: totalAmount,
      notes: notes,
    };

    if (paymentMethod === 'Thanh toán qua MOMO') {
      try {
        const response = await fetch('http://localhost:5000/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalAmount,
            extraData: JSON.stringify(orderData), // Truyền toàn bộ dữ liệu đơn hàng dưới dạng chuỗi JSON
          }),
        });

        const data = await response.json();
        if (data.payUrl) {
          window.location.href = data.payUrl; // Chuyển hướng người dùng đến trang thanh toán của MoMo
        } else {
          console.error('Failed to get payment URL:', data);
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
      }
    } else {
      console.log('Thanh toán bằng tiền mặt');
      alert('Đơn hàng đã được tạo thành công. Vui lòng thanh toán khi nhận hàng.');
    }
  };

  const storeAddress = '806 QL22, ấp Mỹ Hoà 3, Hóc Môn, Hồ Chí Minh';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Thông tin đặt hàng</h2>

      {/* Hiển thị thông tin khách hàng */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>
        <p>Tên: {customerInfo.name}</p>
        <p>Email: {customerInfo.email}</p>
        <p>Số điện thoại: {customerInfo.phoneNumber}</p>
      </div>

      {/* Hiển thị sản phẩm trong giỏ hàng của user */}
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.productId} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center">
              <img
                src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : '/default-image.jpg'}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-red-500">
                  {item.price.toLocaleString()}{' '}
                  <span className="line-through text-gray-500">{item.originalPrice?.toLocaleString()}</span>
                </p>
                <p>Số lượng: {item.quantity}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Giỏ hàng của bạn trống. Hãy mua gì đó rồi quay lại nhé</p>
      )}

      {/* Thông tin giao / nhận hàng */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Thông tin nhận hàng</h3>
        <div className="flex items-center space-x-8 mb-4">
          <div className="flex items-center cursor-pointer" onClick={() => setShippingOption('store')}>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                shippingOption === 'store' ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
              } mr-2 flex items-center justify-center`}
            >
              {shippingOption === 'store' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
            <label className="text-gray-800">Nhận tại cửa hàng</label>
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => setShippingOption('delivery')}>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                shippingOption === 'delivery' ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
              } mr-2 flex items-center justify-center`}
            >
              {shippingOption === 'delivery' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
            <label className="text-gray-800">Giao hàng tận nơi</label>
          </div>
        </div>
        {shippingOption === 'store' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Tỉnh / Thành phố</label>
                <select className="w-full p-2 border rounded-lg" disabled>
                  <option value="Ho Chi Minh">Hồ Chí Minh</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Quận/huyện</label>
                <select className="w-full p-2 border rounded-lg" disabled>
                  <option value="Hoc Mon">Hóc Môn</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Địa chỉ cửa hàng</label>
              <p className="bg-gray-100 p-2 rounded-lg">{storeAddress}</p>
            </div>
          </>
        ) : (
          <>
            <label className="block mb-2">Địa chỉ nhận hàng</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              value={customerInfo.address}
              readOnly
            />
          </>
        )}
      </div>

      {/* Thêm ghi chú */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Ghi chú khác (nếu có)</h3>
        <textarea
          className="w-full p-2 border rounded-lg"
          value={notes}
          onChange={(e) => setNotes(e.target.value)} // Cập nhật ghi chú
          placeholder="Nhập ghi chú"
        />
      </div>

      {/* Dropdown phương thức thanh toán */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
        <select
          className="w-full p-2 border rounded-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Thanh toán qua MOMO">Thanh toán qua MOMO</option>
          <option value="Thanh toán qua VNpay">Thanh toán qua VNpay</option>
        </select>
      </div>

      {/* Tóm tắt hoá đơn thanh toán */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Tổng tiền tạm tính</h3>
        <p className="text-red-500 text-xl">{totalAmount.toLocaleString()}</p>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-semibold"
      >
        Tiếp tục
      </button>
    </div>
  );
};

export default Checkout;
