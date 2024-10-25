import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

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
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountedAmount, setDiscountedAmount] = useState(0);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
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
        const response = await fetch(`${BASE_URL}/api/cart/${userId}`);
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

  // Thêm useEffect để fetch mã giảm giá
  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/discountCodes`);
        if (!response.ok) throw new Error('Failed to fetch discount codes');
        const data = await response.json();
        // Sắp xếp theo phn trăm giảm giá từ cao đến thấp
        const sortedCodes = data.sort((a, b) => b.discountPercent - a.discountPercent);
        setDiscountCodes(sortedCodes);
      } catch (error) {
        console.error('Error fetching discount codes:', error);
      }
    };
    fetchDiscountCodes();
  }, []);

  // Handler khi chọn mã giảm giá
  const handleSelectDiscount = (discount) => {
    setSelectedDiscount(discount);
    const discountAmount = Math.min(
      (totalAmount * discount.discountPercent) / 100,
      discount.maxDiscountAmount
    );
    setDiscountedAmount(discountAmount);
    setShowDiscountDialog(false);
  };

  // Thêm handler để xóa mã giảm giá
  const handleRemoveDiscount = () => {
    setSelectedDiscount(null);
    setDiscountedAmount(0);
  };

  const handleContinue = async () => {
    const finalAmount = totalAmount - discountedAmount; // Tính tổng tiền sau khi giảm giá

    const orderData = {
      customerId: userId,
      customerName: customerInfo.name,
      shippingAddress: customerInfo.address,
      items: cartItems,
      paymentMethod: paymentMethod,
      totalAmount: finalAmount, // Sử dụng số tiền sau khi đã giảm giá
      notes: notes,
      // Thêm thông tin về mã giảm giá nếu có
      discount: selectedDiscount ? {
        discountId: selectedDiscount.id,
        discountName: selectedDiscount.name,
        discountAmount: discountedAmount
      } : null
    };

    if (paymentMethod === 'Thanh toán qua MOMO') {
      try {
        const response = await fetch(`${BASE_URL}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalAmount: finalAmount, // Sử dụng số tiền sau khi đã giảm giá
            extraData: JSON.stringify(orderData),
          }),
        });

        const data = await response.json();
        if (data.payUrl) {
          window.location.href = data.payUrl;
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
                src={item.image ? `${BASE_URL}/${item.image.replace(/\\/g, '/')}` : '/default-image.jpg'}
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

      {/* Thêm nút và dialog mã giảm giá */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Mã giảm giá</h3>
          {!selectedDiscount ? (
            <button
              onClick={() => setShowDiscountDialog(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              Chọn mã giảm giá
            </button>
          ) : (
            <button
              onClick={handleRemoveDiscount}
              className="text-red-500 hover:text-red-700"
            >
              Xóa mã giảm giá
            </button>
          )}
        </div>
        {selectedDiscount && (
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedDiscount.name}</p>
                <p className="text-sm text-gray-600">
                  Giảm {selectedDiscount.discountPercent}% 
                  (Tối đa {selectedDiscount.maxDiscountAmount.toLocaleString()}đ)
                </p>
                <p className="text-green-600 font-medium">
                  -{discountedAmount.toLocaleString()}đ
                </p>
              </div>
              <button
                onClick={handleRemoveDiscount}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog mã giảm giá */}
      {showDiscountDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Chọn mã giảm giá</h3>
              <button
                onClick={() => setShowDiscountDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {discountCodes.map((discount) => {
                // Kiểm tra điều kiện áp dụng mã giảm giá
                const isApplicable = totalAmount >= discount.minOrderValue;
                
                return (
                  <div
                    key={discount.id}
                    className={`border rounded p-3 ${
                      isApplicable 
                        ? 'hover:bg-gray-50' 
                        : 'opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{discount.name}</h4>
                        <div className="space-y-1 mt-1">
                          <p className="text-sm text-gray-600">
                            Giảm {discount.discountPercent}% 
                            (Tối đa {discount.maxDiscountAmount.toLocaleString()}đ)
                          </p>
                          <p className="text-xs text-gray-500">
                            Đơn tối thiểu {discount.minOrderValue.toLocaleString()}đ
                          </p>
                          {!isApplicable && (
                            <p className="text-xs text-red-500">
                              Đơn hàng chưa đạt giá trị tối thiểu
                            </p>
                          )}
                          {discount.endDate && (
                            <p className="text-xs text-gray-500">
                              HSD: {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <button
                          className={`px-4 py-1.5 rounded text-sm w-32 ${
                            isApplicable
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          onClick={() => isApplicable && handleSelectDiscount(discount)}
                          disabled={!isApplicable}
                        >
                          {isApplicable ? 'Áp dụng' : 'Không đủ điều kiện'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cập nhật phần tổng tiền */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Tổng tiền</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{totalAmount.toLocaleString()}đ</span>
          </div>
          {selectedDiscount && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>-{discountedAmount.toLocaleString()}đ</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-xl">
            <span>Tổng cộng:</span>
            <span className="text-red-500">
              {(totalAmount - discountedAmount).toLocaleString()}đ
            </span>
          </div>
        </div>
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
