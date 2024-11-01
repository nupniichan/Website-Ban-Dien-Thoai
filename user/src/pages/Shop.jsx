import axios from "axios";
import { useEffect, useState } from "react";
import Heading from "../shared/Heading";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);

    // Temporary states for filter changes
    const [tempSelectedBrands, setTempSelectedBrands] = useState([]);
    const [tempSelectedColors, setTempSelectedColors] = useState([]);
    const [tempPriceRange, setTempPriceRange] = useState([0, 20000000]);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 20000000]);

    const [maxPrice, setMaxPrice] = useState(20000000);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get("http://4.242.20.80:5000/api/products/");
                setProducts(response.data);
                setFilteredProducts(response.data);

                // Calculate the maximum price
                const highestPrice =
                    Math.ceil(
                        Math.max(...response.data.map((item) => item.price)) /
                            1000
                    ) * 1000;
                setMaxPrice(highestPrice);
                setTempPriceRange([0, highestPrice]);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get("http://4.242.20.80:5000/api/brands");
                setBrands(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await axios.get("http://4.242.20.80:5000/api/colors");
                setColors(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProducts();
        fetchBrands();
        fetchColors();
    }, []);

    const toggleBrandFilter = () => {
        setIsBrandOpen(!isBrandOpen);
        setIsPriceOpen(false);
        setIsColorOpen(false);
    };

    const togglePriceFilter = () => {
        setIsPriceOpen(!isPriceOpen);
        setIsBrandOpen(false);
        setIsColorOpen(false);
    };

    const toggleColorFilter = () => {
        setIsColorOpen(!isColorOpen);
        setIsBrandOpen(false);
        setIsPriceOpen(false);
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleBrandSelection = (brand) => {
        setTempSelectedBrands((prevSelectedBrands) => {
            return prevSelectedBrands.includes(brand)
                ? prevSelectedBrands.filter((b) => b !== brand)
                : [...prevSelectedBrands, brand];
        });
    };

    const handleColorSelection = (color) => {
        setTempSelectedColors((prevSelectedColors) => {
            return prevSelectedColors.includes(color)
                ? prevSelectedColors.filter((c) => c !== color)
                : [...prevSelectedColors, color];
        });
    };

    const handleSliderChange = (range) => {
        setTempPriceRange(range);
    };

    const applyFilters = () => {
        setSelectedBrands(tempSelectedBrands);
        setSelectedColors(tempSelectedColors);
        setPriceRange(tempPriceRange);

        let filtered = products;

        if (tempSelectedBrands.length > 0) {
            filtered = filtered.filter((item) =>
                tempSelectedBrands.includes(item.brand)
            );
        }

        if (tempSelectedColors.length > 0) {
            filtered = filtered.filter((item) =>
                tempSelectedColors.includes(item.color)
            );
        }

        filtered = filtered.filter(
            (item) =>
                item.price >= tempPriceRange[0] &&
                item.price <= tempPriceRange[1]
        );

        setFilteredProducts(filtered);
    };

    const resetFilters = () => {
        setTempSelectedBrands([]);
        setTempSelectedColors([]);
        setTempPriceRange([0, maxPrice]);

        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceRange([0, maxPrice]);

        setFilteredProducts(products);
    };

    // Tính toán sản phẩm hiển thị dựa trên trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const currentProducts = filteredProducts.slice(0, indexOfLastProduct);

    // Hàm xử lý nút "Xem thêm"
    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleBuyNow = (e, productId) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra thẻ cha
        navigate(`/checkout/${productId}`); // Điều hướng đến trang checkout
    };

    return (
        <div className="mb-32">
            <div className="container">
                <Heading title="Cửa Hàng" subtitle="Khám Phá Tất Cả Sản Phẩm" />

                <div className="mb-10 relative">
                    <div className="flex items-center">
                        <button
                            onClick={toggleBrandFilter}
                            className="bg-gray-100 text-black py-2 px-4 rounded-full"
                        >
                            Thương hiệu
                        </button>
                        <button
                            onClick={togglePriceFilter}
                            className="bg-gray-100 text-black py-2 px-4 rounded-full ml-2"
                        >
                            Giá
                        </button>
                        <button
                            onClick={toggleColorFilter}
                            className="bg-gray-100 text-black py-2 px-4 rounded-full ml-2"
                        >
                            Màu
                        </button>

                        {/* Apply Filters Button */}
                        <button
                            onClick={applyFilters}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 ml-2"
                        >
                            Áp dụng
                        </button>

                        {/* Reset Filters Button */}
                        <button
                            onClick={resetFilters}
                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 ml-2"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Brand Filter Section */}
                    {isBrandOpen && (
                        <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                            <h3 className="font-semibold mb-1">Thương hiệu</h3>
                            <ul>
                                {brands.map((brand, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedBrands.includes(
                                                brand
                                            )}
                                            onChange={() =>
                                                handleBrandSelection(brand)
                                            }
                                            className="mr-2"
                                        />
                                        <label
                                            onClick={() =>
                                                handleBrandSelection(brand)
                                            }
                                        >
                                            {brand}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Price Filter Section */}
                    {isPriceOpen && (
                        <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                            <h3 className="font-semibold mb-2">Khoảng giá</h3>
                            <Slider
                                range
                                min={0}
                                max={maxPrice} // Use the dynamically calculated maxPrice
                                step={5000}
                                value={tempPriceRange}
                                onChange={handleSliderChange}
                            />
                            <div className="mt-4 flex justify-between">
                                <input
                                    type="number"
                                    min={0}
                                    max={maxPrice} // Update max here too
                                    value={tempPriceRange[0]}
                                    onChange={(e) =>
                                        setTempPriceRange([
                                            +e.target.value,
                                            tempPriceRange[1],
                                        ])
                                    }
                                    className="w-30 border rounded px-2 py-1"
                                />
                                <span className="px-2">-</span>
                                <input
                                    type="number"
                                    min={0}
                                    max={maxPrice} // Update max here too
                                    value={tempPriceRange[1]}
                                    onChange={(e) =>
                                        setTempPriceRange([
                                            tempPriceRange[0],
                                            +e.target.value,
                                        ])
                                    }
                                    className="w-30 border rounded px-2 py-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Color Filter Section */}
                    {isColorOpen && (
                        <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                            <h3 className="font-semibold mb-1">Màu</h3>
                            <ul>
                                {colors.map((color, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedColors.includes(
                                                color
                                            )}
                                            onChange={() =>
                                                handleColorSelection(color)
                                            }
                                            className="mr-2"
                                        />
                                        <label
                                            onClick={() =>
                                                handleColorSelection(color)
                                            }
                                        >
                                            {color}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
                        {currentProducts.map((item) => (
                            <div
                                key={item.id}
                                className="productcard-item group h-[21em] md:h-[23em] lg:h-[25.5em] rounded-2xl shadow p-4 cursor-pointer relative"
                            >
                                <div onClick={() => handleProductClick(item.id)} className="cursor-pointer">
                                    <div className="productcard-img relative">
                                        {item.image ? (
                                            <img
                                                src={`${BASE_URL}/${item.image}`}
                                                alt={item.name}
                                                className="h-[13em] w-[13em] lg:h-[18em] lg:w-[18em] sm:h-[13em] sm:w-[13em] md:h-[13.5em] md:w-[16em] object-cover rounded-xl mb-3"
                                            />
                                        ) : (
                                            <p>Image not available</p>
                                        )}
                                    </div>
                                    <div className="productcard-content text-left">
                                        <h2 className="font-bold text-lg mb-2">
                                            {item.name}
                                        </h2>
                                        <p className="text-gray-600">
                                            {item.brand}
                                        </p>
                                        <p className="text-red-500 font-semibold">
                                            {item.price.toLocaleString()} đ
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleBuyNow(e, item.id)}
                                    className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Thêm nút "Xem thêm" */}
                    {currentProducts.length < filteredProducts.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600"
                            >
                                Xem thêm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
