import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { Spin, Pagination } from "antd"; // Import Spin for loading animation and Pagination

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query") || "";

        if (query) {
            fetchProducts(query);
        }
    }, [location.search]);

    const fetchProducts = async (query) => {
        setLoading(true); // Start loading

        try {
            const response = await fetch(
                `${BASE_URL}/api/products?query=${query}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Tính toán sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="max-w-6xl mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8">
                Search Results
            </h1>
            {loading ? ( // Show loading spinner if loading
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <img
                                        src={`${BASE_URL}/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-80 rounded-t-lg object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold">
                                            {product.name}
                                        </h2>
                                        <p className="text-red-600 mb-2 text-[19px]">
                                            Price:{" "}
                                            <span className="font-bold">
                                                {product.price.toLocaleString()} VND
                                            </span>
                                        </p>
                                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xl text-gray-600">
                                No products found.
                            </p>
                        )}
                    </div>
                    {products.length > productsPerPage && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={currentPage}
                                total={products.length}
                                pageSize={productsPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default SearchResults;
