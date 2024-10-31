import Button from "../../shared/Button";
import Image1 from "../../assets/fakeAssets/category/earphone.png";
import Image3 from "../../assets/fakeAssets/category/macbook.png";
import XiaomiPhone from "../../assets/fakeAssets/category/xiaomi_phone.png";
import Apple from "../../assets/BrandLogos/Apple.svg";
import Xiaomi from "../../assets/BrandLogos/Xiaomi_logo.svg";
import Huawei from "../../assets/BrandLogos/Huawei_logo.svg";
import { useNavigate } from "react-router-dom";

// TODO: Navigate to product page filtered with that brand
const Featured = () => {
    const navigate = useNavigate();

    const handleCategoryBrowse = (brand) => {
        // navigate(`/products?brand=${brand}`);
    }

    return (
        <section className="py-8">
            <div className="container">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* first col */}
                    <div className="py-10 pl-5 bg-gradient-to-tr from-gray-400/90 to-gray-100 text-white rounded-3xl relative h-[320px] flex items-end">
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-gray-500">Enjoy</p>
                                <p className="text-2xl font-semibold mb-[2px]">
                                    With
                                </p>
                                <p className="my-3 text-4xl translate-x-2 xl:text-5xl">
                                    <img
                                        src={Huawei}
                                        alt=""
                                        style={{
                                            width: "50%",
                                            "@media (min-width: 640px)": {
                                                width: "50%",
                                            },
                                            "@media (min-width: 768px)": {
                                                width: "33.33%",
                                            },
                                            "@media (min-width: 1024px)": {
                                                width: "25%",
                                            },
                                            "@media (min-width: 1280px)": {
                                                width: "20%",
                                            },
                                        }}
                                    />
                                </p>
                                <Button
                                    text="Browse"
                                    bgColor={"bg-primary"}
                                    textColor={"text-white"}
                                />
                            </div>
                        </div>
                        <img
                            src={Image1}
                            alt=""
                            className="w-[320px] absolute bottom-0"
                        />
                    </div>

                    {/* second col */}
                    <div className="py-10 pl-5 bg-gradient-to-br from-brandYellow/90 to-brandYellow/90 text-white rounded-3xl relative h-[320px] flex items-end">
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-white">Enjoy</p>
                                <p className="text-2xl font-semibold mb-[2px]">
                                    With
                                </p>
                                <p className="-mt-6 text-4xl font-bold xl:text-5xl 2xl:-my-4 lg:-my-2 2xl:-mt-5 2xl:-translate-x-5 lg:-translate-x-3 md:-translate-x-5 sm:-translate-x-4">
                                    <img
                                        src={Xiaomi}
                                        alt="Xiaomi logo"
                                        style={{
                                            width: "45%",
                                            "@media (min-width: 640px)": {
                                                width: "50%",
                                            },
                                            "@media (min-width: 768px)": {
                                                width: "33.33%",
                                            },
                                            "@media (min-width: 1024px)": {
                                                width: "25%",
                                            },
                                            "@media (min-width: 1280px)": {
                                                width: "20%",
                                            },
                                        }}
                                    />
                                </p>
                                <Button
                                    text="Browse"
                                    bgColor={"bg-white"}
                                    textColor={"text-brandYellow"}
                                />
                            </div>
                        </div>
                        <img
                            src={XiaomiPhone}
                            alt=""
                            className="absolute 2xl:-right-3 xl:-right-1 lg:-right-2 md:-right-2 sm:-right-2 xl:top-[2em] lg:top-[4em] md:top-[2em] sm:top-[3em]"
                            style={{
                                width: "70%",
                                "@media (min-width: 640px)": {
                                    width: "50%",
                                },
                                "@media (min-width: 768px)": {
                                    width: "33.33%",
                                },
                                "@media (min-width: 1024px)": {
                                    width: "25%",
                                },
                                "@media (min-width: 1280px)": {
                                    width: "30%",
                                },
                            }}
                        />
                    </div>

                    {/* third col */}
                    <div className="col-span-2 py-10 pl-5 bg-gradient-to-br from-black/90 to-black/70 text-white rounded-3xl relative h-[320px] flex items-end">
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-white">Enjoy</p>
                                <p className="text-2xl font-semibold">With</p>
                                <p className="mt-3 font-bold 2xl:text-6xl xl:text-6xl md:text-5xl sm:text-6xl opacity-40 my-7">
                                    <img
                                        src={Apple}
                                        alt="Apple logo"
                                        className="w-8 inline -translate-y-1.5"
                                    />{" "}
                                    Apple
                                </p>
                                <Button
                                    text="Browse"
                                    bgColor={"bg-white"}
                                    textColor={"text-[#1b1b1b]"}
                                />
                            </div>
                        </div>
                        <img
                            src={Image3}
                            alt=""
                            className="w-[290px] absolute top-1/2 -translate-y-1/2 2xl:right-14 xl:right-7 lg:right-1 md:right-16 sm:right-2"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Featured;
