import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Heading from "../shared/Heading";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(200000);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products/");
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/brands");
                setBrands(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProducts();
        fetchBrands();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleBrandSelection = (brand) => {
        setSelectedBrands((prevSelectedBrands) => {
            return prevSelectedBrands.includes(brand)
                ? prevSelectedBrands.filter((b) => b !== brand)
                : [...prevSelectedBrands, brand];
        });
    };

    useEffect(() => {
        applyFilters();
    }, [selectedBrands, priceRange]);

    const applyFilters = () => {
        let filtered = products;

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(item => selectedBrands.includes(item.brand));
        }

        filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        setFilteredProducts(filtered);
    };

    const handleMinPriceChange = (e) => {
        const newMinPrice = parseInt(e.target.value) || 0;
        setMinPrice(newMinPrice);
        setPriceRange([newMinPrice, priceRange[1]]);
    };

    const handleMaxPriceChange = (e) => {
        const newMaxPrice = parseInt(e.target.value) || 200000;
        setMaxPrice(newMaxPrice);
        setPriceRange([priceRange[0], newMaxPrice]);
    };

    const handleSliderChange = (range) => {
        setPriceRange(range);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="mb-32">
            <div className="container">
                <Heading title="Shop" subtitle="Browse All Products" />

                <div className="mb-10 relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2 bg-gray-100 text-black py-2 px-4 rounded-full focus:outline-none shadow-sm"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M6 9h12M9 14h6" />
                        </svg>
                        <span className="font-medium">Bộ lọc</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7 7 7-7" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                            <div className="mb-4">
                                <h3 className="font-semibold mb-1">Brands</h3>
                                <ul>
                                    {brands.map((brand, index) => (
                                        <li key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => handleBrandSelection(brand)}
                                            />
                                            <label
                                                className="text-left cursor-pointer"
                                                onClick={() => handleBrandSelection(brand)}
                                            >
                                                {brand}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Price Range</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={handleMinPriceChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        min="0"
                                        max={maxPrice}
                                        placeholder="Min price"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={handleMaxPriceChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        min={minPrice}
                                        placeholder="Max price"
                                    />
                                </div>
                                <Slider
                                    range
                                    min={minPrice}
                                    max={maxPrice}
                                    step={5000}
                                    value={priceRange}
                                    onChange={handleSliderChange}
                                    trackStyle={{ backgroundColor: '#4299e1' }}
                                    handleStyle={{ borderColor: '#4299e1' }}
                                />
                                <div className="text-sm text-gray-500 mt-2">
                                    {priceRange[0].toLocaleString()} đ - {priceRange[1].toLocaleString()} đ
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
                        {filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                className="productcard-item group h-[21em] md:h-[23em] lg:h-[25.5em] rounded-2xl shadow p-4 cursor-pointer"
                                onClick={() => handleProductClick(item.id)}
                            >
                                <div className="productcard-img relative">
                                    {item.image ? (
                                        <img
                                            src={`${BASE_URL}/${item.image}`}
                                            alt={item.name}
                                            className="h-[13em] w-[13em] lg:h-[18em] lg:w-[18em] sm:h-[13em] sm:w-[13em] md:h-[13.5em] md:w-[16em] object-cover rounded-xl mb-3"
                                        />
                                    ) : (
                                        <div className="h-[180px] w-[260px] flex items-center justify-center bg-gray-200 rounded-xl mb-3">
                                            <span>No Image Available</span>
                                        </div>
                                    )}
                                </div>
                                <div className="leading-7">
                                    <h2 className="lg:text-lg md:text-sm font-semibold sm:text-base">
                                        {item.name}
                                    </h2>
                                    <h2 className="lg:text-sm text-red-600 font-bold sm:text-xs">
                                        {item.price.toLocaleString()} đ
                                    </h2>
                                </div>

                                <div onClick={(e) => e.stopPropagation()} className="mt-[-5%] ml-36">
                                    <button
                                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                        onClick={() => handleProductClick(item.id)}
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
