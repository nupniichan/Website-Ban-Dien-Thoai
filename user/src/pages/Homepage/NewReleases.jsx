import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Heading from "../../shared/Heading";
import StarRating from "../../shared/StarRating";

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
                console.error(error);
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
            <div className="container">
                {/* Heading section */}
                <Heading
                    title="New Releases"
                    subtitle="Explore Our Newcomers"
                />
                {/* Body section */}
                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
                        {/* card selection */}
                        {NReleaseProducts.map((item) => (
                            <div
                                key={item.id}
                                className="productcard-item group h-[21em] md:h-[23em] lg:h-[25.5em] rounded-2xl [box-shadow:0_1px_2px_0_rgba(60,64,67,.1),0_2px_6px_2px_rgba(60,64,67,.15)] p-4 cursor-pointer group transition"
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
                                            <span>No Image Available</span>
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
                                    <h2 className="lg:text-sm  text-red-600 font-bold sm:text-xs">
                                        {item.price} đ
                                    </h2>
                                </div>

                                {/* Star Rating */}
                                <div onClick={(e) => e.stopPropagation()}>
                                    <StarRating rating={item.rating} />
                                </div>

                                {/* Buttons */}
                                <div className="absolute top-6 -right-11 group-hover:right-5 p-2 flex flex-col items-center justify-center gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button>
                                        <div className="flex justify-center items-center text-white bg-red-600 w-12 h-12">
                                            <PlusOutlined className="text-3xl" />
                                        </div>
                                    </button>
                                    <div
                                        onClick={() =>
                                            handleProductClick(item.id)
                                        }
                                        className="w-12 h-12 bg-white justify-center items-center text-black drop-shadow-xl"
                                    >
                                        <EyeOutlined className="text-3xl" />
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
