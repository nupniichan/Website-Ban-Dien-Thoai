import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Heading from "../../shared/Heading";
import { BASE_URL } from "../../config";
import StarRating from "../../shared/StarRating";
import { useNavigate } from "react-router-dom";

const NewReleases = () => {
    const [products, setProducts] = useState([]);
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
        "SP023",
        "SP022",
        "SP035",
        "SP036",
    ]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    }
    // useEffect(() => {
    //     console.log(NReleaseProducts);
    // }, [NReleaseProducts]);

    return (
        <div className="mb-32">
            <div className="container">
                {/* Phần tiêu đề */}
                <Heading
                    title="Sản Phẩm Mới"
                    subtitle="Khám Phá Sản Phẩm Mới Nhất"
                />
                {/* Phần nội dung */}
                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
                        {/* phần thẻ sản phẩm */}
                        {NReleaseProducts.map((item) => (
                            <div
                                key={item.id}
                                className="productcard-item group h-[21em] md:h-[23em] lg:h-[25.5em] rounded-2xl [box-shadow:0_1px_2px_0_rgba(60,64,67,.1),0_2px_6px_2px_rgba(60,64,67,.15)] p-4 cursor-pointer"
                                onClick={() => handleProductClick(item.id)}
                            >
                                <div className="productcard-img relative">
                                    {item.image ? (
                                        <img
                                            src={`${BASE_URL}/${item.image}`}
                                            alt={item.image}
                                            className="h-[13em] w-[13em] lg:h-[18em] lg:w-[18em] sm:h-[13em] sm:w-[13em] md:h-[13.5em] md:w-[16em] object-cover rounded-xl mb-3"
                                        />
                                    ) : (
                                        <div className="h-[180px] w-[260px] flex items-center justify-center bg-gray-200 rounded-xl mb-3">
                                            <span>Không có hình ảnh</span>
                                        </div>
                                    )}
                                    {/* hover button */}
                                    {/* <div className="hidden group-hover:flex absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200">
                                        <PlusCircleOutlined className="text-primary text-5xl hover:-translate-y-1 active:scale-75 active:translate-y-1 transform transition-transform duration-75 ease-linear" />
                                    </div> */}
                                </div>
                                <div className="leading-7">
                                    <h2 className="lg:text-lg md:text-sm font-semibold sm:text-base">
                                        {item.name}
                                    </h2>
                                    <h2 className="lg:text-sm text-red-600 font-bold sm:text-xs">
                                        {item.price.toLocaleString()} đ
                                    </h2>
                                </div>

                                {/* Star Rating 
                                <div onClick={(e) => e.stopPropagation()}>
                                    <StarRating rating={item.rating} />
                                </div>
                                */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewReleases;
