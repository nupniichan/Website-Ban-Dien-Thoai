import Heading from "../../shared/Heading";
import ProductCard from "./ProductCard";

import Img1 from "../../assets/fakeAssets/product/p-1.jpg";
import Img2 from "../../assets/fakeAssets/product/p-2.jpg";
import Img3 from "../../assets/fakeAssets/product/p-3.jpg";
import Img4 from "../../assets/fakeAssets/product/p-4.jpg";

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
    return (
        <div>
            <div className="container">
                {/* Heading section */}
                <Heading title="New Releases" subtitle="Explore Our Newcomers" />
                {/* Body section */}
                <ProductCard data={ProductsData}/>
            </div>
        </div>
    );
};

export default NewReleases;
