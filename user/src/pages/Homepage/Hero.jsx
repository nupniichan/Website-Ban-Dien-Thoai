import { Carousel } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Img1 from "../../assets/fakeAssets/hero/headphone.png";
import Img2 from "../../assets/fakeAssets/hero/watch.png";
import Button from "../../shared/Button.jsx";

const HeroPlaceholderData = [
    {
        id: 1,
        image: Img1,
        title: "Wireless",
        title2: "Heaphones",
        description: "Beats Solo",
    },
    {
        id: 2,
        image: Img2,
        title: "Wireless",
        title2: "Virtual",
        description: "Beats Duo",
    }
]
// TODO: Bind actual data to the carousel

const Hero = () => {
    const [products, setProducts] = useState([]);

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
        return products.filter((product) => product.id === ids);
    };

    const heroProducts = getProductsById(["SP023", "SP035"]);

    return (
        <div className="container">
            <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] hero-bg-color flex justify-center items-center">
                <div className="container pb-8 sm:pb-0">
                    <Carousel
                        dots={false}
                        arrows={false}
                        infinite={true}
                        speed={800}
                        draggable={true}
                        autoplay={true}
                        autoplaySpeed={4000}
                        easing="ease-in-out"
                    >
                        {HeroPlaceholderData.map((product) => (
                            <div key={product.id}>
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    {/* text content section */}
                                    <div className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                                        {/* <h1 className="text-2xl sm:text-6xl lg:text-2xl font-bold">
                                            {product.description}
                                        </h1> */}
                                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                                            {product.title}
                                        </h1>
                                        <h1 className="text-5xl uppercase text-white dark:text-white/5 sm:text-[80px] md:text-[100px] xl:text-[150px] font-bold">
                                            {product.title2}
                                        </h1>
                                        <div>
                                            <Button
                                                text="Discover"
                                                bgColor="bg-primary"
                                                textColor="text-white"
                                            />
                                        </div>
                                    </div>
                                    {/* Img section */}
                                    <div className="order-1 sm:order-2">
                                        <div>
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] sm:scale-105 lg:scale-110 object-contain mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] relative z-40"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Hero;
