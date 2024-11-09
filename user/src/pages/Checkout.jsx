import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import PathNames from "../PathNames.js";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    });
    const [shippingOption, setShippingOption] = useState("store");
    const [paymentMethod, setPaymentMethod] = useState("Thanh toán qua MOMO");
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [notes, setNotes] = useState(""); // Lưu trữ ghi chú từ người dùng
    const [showDiscountDialog, setShowDiscountDialog] = useState(false);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [discountedAmount, setDiscountedAmount] = useState(0);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch customer info");
                }
                const data = await response.json();
                setCustomerInfo({
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                });
            } catch (error) {
                console.error("Error fetching customer info:", error);
            }
        };

        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
            setTotalAmount(location.state.total);
        } else {
            navigate(PathNames.CART);
        }

        if (userId) {
            fetchCustomerInfo();
        } else {
            console.error("No userId found in sessionStorage");
        }
    }, [userId, location.state, navigate]);

    // Thêm useEffect để fetch mã giảm giá
    useEffect(() => {
        const fetchDiscountCodes = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/discountCodes`);
                if (!response.ok) {
                    throw new Error("Failed to fetch discount codes");
                }
                const data = await response.json();
                // Sắp xếp theo phn trăm giảm giá từ cao đến thấp
                const sortedCodes = data.sort(
                    (a, b) => b.discountPercent - a.discountPercent,
                );
                setDiscountCodes(sortedCodes);
            } catch (error) {
                console.error("Error fetching discount codes:", error);
            }
        };
        fetchDiscountCodes();
    }, []);

    // Handler khi chọn mã giảm giá
    const handleSelectDiscount = (discount) => {
        setSelectedDiscount(discount);
        const discountAmount = Math.min(
            Math.floor((totalAmount * discount.discountPercent) / 100),
            discount.maxDiscountAmount,
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
        // Chuyển đổi số tiền về dạng số nguyên
        const finalAmount = totalAmount - discountedAmount;

        // Tạo object chứa thông tin cần thiết cho thanh toán
        const paymentData = {
            customerId: userId,
            customerName: customerInfo.name,
            amount: finalAmount,
            paymentMethod: paymentMethod,
            customerNote: notes,
            discountId: selectedDiscount?.id || null,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress: shippingOption === "store" ? storeAddress : customerInfo.address,
        };

        if (paymentMethod === "MoMo") {
            try {
                // Gọi API tạo thanh toán MOMO
                const paymentResponse = await fetch(`${BASE_URL}/payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: finalAmount,
                        extraData: JSON.stringify(paymentData),
                        orderInfo: `Thanh toán đơn hàng cho ${customerInfo.name}`
                    }),
                });

                const result = await paymentResponse.json();

                if (!paymentResponse.ok) {
                    throw new Error(result.message || "Lỗi kết nối đến cổng thanh toán");
                }

                if (result.payUrl) {
                    // Lưu ID sản phẩm để xóa khỏi giỏ hàng sau khi thanh toán thành công
                    sessionStorage.setItem('checkoutItems', JSON.stringify(
                        cartItems.map(item => item.productId)
                    ));

                    // Chuyển hướng đến trang thanh toán MOMO
                    window.location.href = result.payUrl;
                } else {
                    throw new Error("Không nhận được URL thanh toán");
                }
            } catch (error) {
                console.error("Lỗi khi xử lý thanh toán:", error);
                notification.error({
                    message: 'Lỗi thanh toán',
                    description: error.message || "Có lỗi xảy ra khi xử lý thanh toán",
                    duration: 4,
                    placement: "bottomRight"
                });
            }
        } else if (paymentMethod === "Tiền mặt") {
            try {
                // Tạo đơn hàng với trạng thái chờ xác nhận
                const response = await fetch(`${BASE_URL}/api/orders/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...paymentData,
                        status: "Chờ xác nhận",
                        paymentStatus: "Chưa thanh toán",
                        paymentMethod: "Tiền mặt"
                    }),
                });

                if (response.ok) {
                    // Xóa sản phẩm khỏi giỏ hàng
                    const productIds = cartItems.map((item) => item.productId);
                    await fetch(`${BASE_URL}/api/cart/${userId}/removeMultiple`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ productIds }),
                    });

                    notification.success({
                        message: 'Đặt hàng thành công',
                        description: 'Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất!',
                        duration: 4,
                        placement: "bottomRight",
                        showProgress: true,
                        pauseOnHover: true,
                    });
                    navigate("/payment-history");
                } else {
                    throw new Error("Lỗi khi tạo đơn hàng");
                }
            } catch (error) {
                console.error("Lỗi khi tạo đơn hàng:", error);
                notification.error({
                    message: 'Lỗi',
                    description: "Có lỗi xảy ra khi tạo đơn hàng",
                    duration: 4,
                    placement: "bottomRight",
                    showProgress: true,
                    pauseOnHover: true,
                });
            }
        }
    };

    const storeAddress = "806 QL22, ấp Mỹ Hoà 3, Hóc Môn, Hồ Chí Minh";

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Thông tin đặt hàng</h2>

            {/* Hiển thị thông tin khách hàng */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Thông tin khách hàng
                </h3>
                <p>Tên: {customerInfo.name}</p>
                <p>Email: {customerInfo.email}</p>
                <p>Số điện thoại: {customerInfo.phoneNumber}</p>
            </div>

            {/* Hiển thị sản phẩm trong giỏ hàng của user */}
            {cartItems.length > 0
                ? (
                    cartItems.map((item) => (
                        <div
                            key={item.productId}
                            className="bg-white p-4 rounded-lg shadow mb-4"
                        >
                            <div className="flex items-center">
                                <img
                                    src={item.image
                                        ? `${BASE_URL}/${
                                            item.image.replace(
                                                /\\/g,
                                                "/",
                                            )
                                        }`
                                        : "/default-image.jpg"}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">
                                        {item.name}
                                    </h3>
                                    <p className="text-red-500">
                                        {item.price.toLocaleString()}{" "}
                                        <span className="line-through text-gray-500">
                                            {item.originalPrice
                                                ?.toLocaleString()}
                                        </span>
                                    </p>
                                    <p>Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )
                : <p>Giỏ hàng của bạn trống. Hãy mua gì đó rồi quay lại nhé</p>}

            {/* Thông tin giao / nhận hàng */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Thông tin nhận hàng
                </h3>
                <div className="flex items-center space-x-8 mb-4">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setShippingOption("store")}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 ${
                                shippingOption === "store"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-500"
                            } mr-2 flex items-center justify-center`}
                        >
                            {shippingOption === "store" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full">
                                </div>
                            )}
                        </div>
                        <label className="text-gray-800">
                            Nhận tại cửa hàng
                        </label>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setShippingOption("delivery")}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 ${
                                shippingOption === "delivery"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-500"
                            } mr-2 flex items-center justify-center`}
                        >
                            {shippingOption === "delivery" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full">
                                </div>
                            )}
                        </div>
                        <label className="text-gray-800">
                            Giao hng tận nơi
                        </label>
                    </div>
                </div>
                {shippingOption === "store"
                    ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">
                                        Tỉnh / Thành phố
                                    </label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        disabled
                                    >
                                        <option value="Ho Chi Minh">
                                            Hồ Chí Minh
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2">
                                        Quận/huyện
                                    </label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        disabled
                                    >
                                        <option value="Hoc Mon">Hóc Môn</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">
                                    Địa chỉ cửa hàng
                                </label>
                                <p className="bg-gray-100 p-2 rounded-lg">
                                    {storeAddress}
                                </p>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <label className="block mb-2">
                                Địa chỉ nhận hàng
                            </label>
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
                <h3 className="text-lg font-semibold mb-2">
                    Ghi chú khác (nếu có)
                </h3>
                <textarea
                    className="w-full p-2 border rounded-lg"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)} // Cập nhật ghi chú
                    placeholder="Nhập ghi chú"
                />
            </div>

            {/* Dropdown phương thức thanh toán */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Phương thức thanh toán
                </h3>
                <select
                    className="w-full p-2 border rounded-lg"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    {shippingOption === "store" && (
                        <option value="Tiền mặt">Tiền mặt</option>
                    )}
                    <option value="MoMo">
                        Thanh toán qua MOMO
                    </option>
                    <option value="Thanh toán qua VNpay">
                        Thanh toán qua VNpay
                    </option>
                </select>
            </div>

            {/* Thêm nút và dialog mã giảm giá */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Mã giảm giá</h3>
                    {!selectedDiscount
                        ? (
                            <button
                                onClick={() => setShowDiscountDialog(true)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Chọn mã giảm giá
                            </button>
                        )
                        : (
                            <button
                                onClick={handleRemoveDiscount}
                                className="text-red-500 hover:text-red-700"
                            >
                                Xóa mã giảm giá
                            </button>
                        )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    * Đơn hàng chỉ được sử dụng 1 mã giảm giá
                </p>
                {selectedDiscount && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">
                                    {selectedDiscount.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Giảm{" "}
                                    {selectedDiscount.discountPercent}% (Tối đa
                                    {" "}
                                    {selectedDiscount.maxDiscountAmount
                                        .toLocaleString()}
                                    đ)
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
                            <h3 className="text-xl font-semibold">
                                Chọn mã giảm giá
                            </h3>
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
                                const isApplicable =
                                    totalAmount >= discount.minOrderValue;

                                return (
                                    <div
                                        key={discount.id}
                                        className={`border rounded p-3 ${
                                            isApplicable
                                                ? "hover:bg-gray-50"
                                                : "opacity-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">
                                                    {discount.name}
                                                </h4>
                                                <div className="space-y-1 mt-1">
                                                    <p className="text-sm text-gray-600">
                                                        Giảm{" "}
                                                        {discount
                                                            .discountPercent}
                                                        % (Tối đa{" "}
                                                        {discount
                                                            .maxDiscountAmount
                                                            .toLocaleString()}
                                                        đ)
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Đơn tối thiểu{" "}
                                                        {discount.minOrderValue
                                                            .toLocaleString()}
                                                        đ
                                                    </p>
                                                    {!isApplicable && (
                                                        <p className="text-xs text-red-500">
                                                            Đơn hàng chưa đt
                                                            giá trị tối thiểu
                                                        </p>
                                                    )}
                                                    {discount.endDate && (
                                                        <p className="text-xs text-gray-500">
                                                            HSD: {new Date(
                                                                discount
                                                                    .endDate,
                                                            ).toLocaleDateString(
                                                                "vi-VN",
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex items-center">
                                                <button
                                                    className={`px-4 py-1.5 rounded text-sm w-32 ${
                                                        isApplicable
                                                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    onClick={() =>
                                                        isApplicable &&
                                                        handleSelectDiscount(
                                                            discount,
                                                        )}
                                                    disabled={!isApplicable}
                                                >
                                                    {isApplicable
                                                        ? "Áp dụng"
                                                        : "Không đủ điều kiện"}
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
