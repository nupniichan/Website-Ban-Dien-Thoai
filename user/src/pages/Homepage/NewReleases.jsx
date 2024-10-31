import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Heading from "../../shared/Heading";

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
    };
    // useEffect(() => {
    //     console.log(NReleaseProducts);
    // }, [NReleaseProducts]);

    return (
        <div className="mb-32">
            <div className="container mx-auto px-4">
                <Heading
                    title="Sản Phẩm Mới"
                    subtitle="Khám Phá Sản Phẩm Mới Nhất"
                    className="mb-8"
                />
                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
                        {NReleaseProducts.map((item) => (
                            <div
                                key={item.id}
                                className="w-full max-w-[20rem] bg-white border hover:shadow-xl transition-shadow duration-300 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                                onClick={() => handleProductClick(item.id)}
                            >
                                <div className="productcard-img relative overflow-hidden group h-[280px]">
                                    {item.image ? (
                                        <>
                                            <img
                                                src={`${BASE_URL}/${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-contain rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <EyeOutlined className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-t-xl">
                                            <span>Không có hình ảnh</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    <h2 className="text-lg font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </h2>
                                    <h2 className="text-red-600 font-bold">
                                        {item.price.toLocaleString()} đ
                                    </h2>
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
