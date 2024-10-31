import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import headphoneImage from "../../assets/fakeAssets/hero/headphone.png";
import AboutUsSection from "./AboutUsSection";
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
    date: "25 Nov to 25 Dec",
    image: headphoneImage,
    title2: "",
    title3: "Sale Lớn Mùa Đông",
    title4: "Vì Một Mùa Noel An Lành",
    bgColor: "bg-primary",
};

const Homepage = () => {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    // NOTE: Get the scroll position of the document
    window.addEventListener(
        "scroll",
        () => {
            document.body.style.setProperty(
                "--scroll",
                window.pageYOffset /
                    (document.body.offsetHeight - window.innerHeight)
            );
        },
        false
    );

    return (
        <main className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
            <Hero />
            <Featured />
            <Featured2 />
            <Services />
            <Banner data={BannerData} />
            <AboutUsSection />
            <NewReleases />
            <Blogs />
            <Partners />
        </main>
    );
};

export default Homepage;
