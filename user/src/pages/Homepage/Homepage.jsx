import headphoneImage from "../../assets/fakeAssets/hero/headphone.png";
import Banner from "./Banner";
import Blogs from "./Blogs";
import Featured from "./Featured";
import Featured2 from "./Featured2";
import Hero from "./Hero";
import NewReleases from "./NewReleases";
import Partners from "./Partners";
import Services from "./Services";


const BannerData = {
    discount: "20% OFF",
    title: "Cold Season",
    date: "20 Oct to 01 Nov",
    image: headphoneImage,
    title2: "Air Solo Bass",
    title3: "Winter Sale",
    title4: "Get Your Winter Essentials",
    bgColor: "bg-primary",
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
