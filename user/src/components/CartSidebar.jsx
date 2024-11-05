import { Drawer } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ArrowTextBtn from "../shared/ArrowTextBtn";

const CartSidebar = ({ cartOpen, setCartOpen }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [tempPriceRange, setTempPriceRange] = useState([0, 20000000]);
    const [maxPrice, setMaxPrice] = useState(20000000);

    const subtotal = 299000;

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/products/"
                );
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
                const response = await axios.get(
                    "http://localhost:5000/api/brands"
                );
                setBrands(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/colors"
                );
                setColors(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProducts();
        fetchBrands();
        fetchColors();
    }, []);

    return (
        <Drawer
            title=<p className="text-xl font-bold">Giỏ Hàng</p>
            onClose={() => setCartOpen(false)}
            open={cartOpen}
            width={600}
            footer=
                <div className="flex items-center justify-between">
                    {/* Subtotal section */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-2xl font-bold">Tổng tiền:</span>
                        <span className="text-2xl font-semibold">
                            {subtotal.toLocaleString()}₫
                        </span>
                    </div>

                    {/* Buttons section */}
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Xem giỏ hàng
                        </button>
                        <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-red-700 transition-colors">
                            Thanh toán
                        </button>
                    </div>
                </div>
        >
            <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex-1">
                    <p>Cart items here</p>
                </div>
            </div>
        </Drawer>
    );
};

export default CartSidebar;
