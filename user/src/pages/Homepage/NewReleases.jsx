import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Heading from "../../shared/Heading";
import { notification } from "antd";
import PathNames from "../../PathNames";

const NewReleases = () => {
    const userId = sessionStorage.getItem("userId");
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/products/"
                );
                const productsData = response.data;
                setProducts(productsData);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    const getProductsById = (ids) => {
        return products.filter((product) => ids.includes(product.id));
    };
    const NReleaseProducts = getProductsById([
        "SP028",
        "SP022",
        "SP035",
        "SP036",
    ]);

    // const handleQuantityChange = (e) => {
    //     const value = parseInt(e.target.value, 10);
    //     if (value > product.quantity) {
    //         setError("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này");
    //         notification.warning({
    //             message: 'Lưu ý',
    //             description: 'Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này',
    //             duration: 4,
    //             placement: "bottomRight",
    //             showProgress: true,
    //             pauseOnHover: true
    //         });
    //     } else {
    //         setError("");
    //     }
    //     setQuantity(value);
    // };

    const handleBuyNow = async (selectedProduct) => {
        if (!userId) {
            notification.warning({
                message: 'Lưu ý',
                description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true
            });
            window.location.href = "/login";
            return;
        }

        if (!selectedProduct || !selectedProduct.id) {
            notification.error({
                message: 'Lỗi',
                description: 'Không tìm thấy thông tin sản phẩm',
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true
            });
            return;
        }

        if (quantity <= 0 || quantity > selectedProduct.quantity) {
            notification.error({
                message: 'Lỗi',
                description: 'Số lượng không hợp lệ!',
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true
            });
            return;
        }

        const cartItem = {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            color: selectedProduct.color,
            quantity: parseInt(quantity),
            image: selectedProduct.image,
        };

        console.log("Sending cart item:", cartItem);

        try {
            const response = await fetch(`${BASE_URL}/api/cart/${userId}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItem),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
                );
            }

            notification.success({
                message: 'Thành công',
                description: 'Đã thêm sản phẩm vào giỏ hàng',
                duration: 4,
                placement: "bottomRight",
                pauseOnHover: true
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            notification.error({
                message: 'Lỗi',
                description: error.message,
                duration: 4,
                placement: "bottomRight",
                pauseOnHover: true
            });
        }
    };

    const handleProductClick = (productId) => {
        navigate(`${PathNames.PRODUCT_DETAILS}/${productId}`);
    };

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="mb-32 mt-80">
            <div className="container">
                {/* Phần tiêu đề */}
                <Heading
                    title="Sản Phẩm Mới"
                    subtitle="Khám Phá Sản Phẩm Mới Nhất"
                />
                {/* Phần nội dung */}
                <div className="mb-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 place-items-center ">
                        {/* card selection */}
                        {NReleaseProducts.map((item) => (
                            <div
                                key={item.id}
                                className="w-[20rem] bg-white border xl:scale-100 lg:scale-90 md:scale-75 sm:scale-50 border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700"
                                onClick={() => handleProductClick(item.id)}
                            >
                                {item.image ? (
                                    <img
                                        className="p-8 rounded-t-lg"
                                        src={`${BASE_URL}/${item.image}`}
                                        alt="product image"
                                    />
                                ) : (
                                    <div className="h-[180px] w-[260px] flex items-center justify-center mb-3">
                                        <span>Missing Image</span>
                                    </div>
                                )}
                                <div className="px-5 pb-5">
                                    <Link href="#">
                                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                            {item.name}
                                        </h5>
                                    </Link>
                                    {/* Rating section */}
                                    {/* <div className="flex items-center mt-2.5 mb-5">
                                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <StarRating
                                                    rating={item.rating}
                                                />
                                            </div>
                                        </div>
                                        <span className="bg-red-100 text-[#f42c37] text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ms-3">
                                            5.0
                                        </span>
                                    </div> */}
                                    <div className="flex items-center justify-between mt-5">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.price)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuyNow(item);
                                            }}
                                            className="text-white bg-[#f42c37] focus:outline-none font-medium rounded-xl hover:scale-105 ease transition-transform text-sm px-5 py-2.5 text-center"
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewReleases;
