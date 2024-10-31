import headphoneImage from "../../assets/fakeAssets/hero/Iphone16.png";
import Banner from "./Banner";
import Blogs from "./Blogs";
import Featured from "./Featured";
import Featured2 from "./Featured2";
import Hero from "./Hero";
import NewReleases from "./NewReleases";
import Partners from "./Partners";
import Services from "./Services";


const BannerData = {
    discount: "Giá cực sốc",
    title: "Giảm giá mùa đông",
    date: "Từ ngày 31/10 đến ngày 20/11",
    image: headphoneImage,
    title2: "iPhone 16 Pro Max",
    title3: "Khuyến mãi mùa đông",
    title4: "Sở hữu iPhone 16 ngay",
    bgColor: "bg-black",
};

const Homepage = () => {

    return (
        <main className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
            <Hero />
            <Featured />
            <Featured2 />
            <Services />
            <Banner data={BannerData} />
            <NewReleases />

            <Blogs />
            <Partners />
        </main>
    );
}

export default Homepage;
