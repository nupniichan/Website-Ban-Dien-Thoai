import axios from "axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Img1 from "../../assets/fakeAssets/product/p-1.jpg";
import Img2 from "../../assets/fakeAssets/product/p-2.jpg";
import Img3 from "../../assets/fakeAssets/product/p-3.jpg";
import Img4 from "../../assets/fakeAssets/product/p-4.jpg";
import Heading from "../../shared/Heading";

const ProductsData = [
    {
        id: 1,
        image: Img1,
        title: "Boat Headphones",
        price: '120',
        aosDelay: '0',
    },
    {
        id: 2,
        image: Img2,
        title: "Rocky Mountain",
        price: '320',
        aosDelay: '200',
    },
    {
        id: 3,
        image: Img3,
        title: "Goggles",
        price: '470',
        aosDelay: '400',
    },
    {
        id: 4,
        image: Img4,
        title: "Printed",
        price: '220',
        aosDelay: '600',
    },
]

const NewReleases = () => {
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
        return products.filter((product) => ids.includes(product.id));
    };

    const NReleaseProducts = getProductsById(["SP023", "SP022", "SP035", "SP036"]);

    useEffect(() => {
        console.log(NReleaseProducts)
    }, [NReleaseProducts]);

    return (
        <div className="mb-32">
            <div className="container">
                {/* Heading section */}
                <Heading title="New Releases" subtitle="Explore Our Newcomers" />
                {/* Body section */}
                <div className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">

                {/* card selection */}
                {NReleaseProducts.map((item) => (
                    <div key={item.id} className="productcard-item group">
                        <div className="productcard-img relative">
                            <img
                                src={item.image}
                                alt=""
                                className="h-[180px] w-[260px] object-cover rounded-xl mb-3"
                            />
                            {/* hover button */}
                            <div className="hidden group-hover:flex absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200">
                                <PlusCircleOutlined className="text-primary text-5xl hover:-translate-y-1 active:scale-75 active:translate-y-1 transform transition-transform duration-75 ease-linear"/>
                            </div>
                        </div>
                        <div className="leading-7">
                            <h2 className="text-lg font-semibold">
                                {item.name}
                            </h2>
                            <h2 className="text-sm text-gray-500 font-bold">
                                ${item.price}
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
