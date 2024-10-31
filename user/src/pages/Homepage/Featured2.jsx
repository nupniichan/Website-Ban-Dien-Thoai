import Button from "../../shared/Button";
import Image1 from "../../assets/fakeAssets/category/gaming.png";
import Image2 from "../../assets/fakeAssets/category/vr.png";
import Image3 from "../../assets/fakeAssets/category/speaker.png";
import Samsung from "../../assets/BrandLogos/Samsung_Logo.svg";
import Oppo from "../../assets/BrandLogos/OPPO_LOGO.svg";
import Sony from "../../assets/BrandLogos/Sony_logo.svg";
import { useNavigate } from "react-router-dom";

// TODO: Navigate to product page filtered with that brand
const Featured2 = () => {
    const navigate = useNavigate();

    const handleCategoryBrowse = (brand) => {
        // navigate(`/products?brand=${brand}`);
    }

    return (
        <section className="py-8">
            <div className="container">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* first col */}
                    <div
                        className="col-span-2 py-10 pl-5 text-white rounded-3xl relative h-[320px] flex items-end"
                        style={{background: "linear-gradient(135deg, rgba(0,0,128,1) 0%, rgba(176,196,222,1) 80%, rgba(255,255,255,1) 100%)"}}>
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-gray-300">Enjoy</p>
                                <p className="text-2xl font-semibold mb-[2px]">
                                    With
                                </p>
                                <p className="my-6 text-4xl font-bold xl:text-5xl opacity-100">
                                    <img
                                        src={Sony}
                                        alt="Sony logo"
                                        className=""
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
                                            }
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
                            className="absolute top-1/2 -translate-y-1/2 right-9"
                            style={{
                                width: "35%",
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
                    </div>

                    {/* second col */}
                    <div className="py-10 pl-5 bg-gradient-to-br from-brandGreen/90 to-brandGreen/70 text-white rounded-3xl relative h-[320px] flex items-start">
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-white">Enjoy</p>
                                <p className="text-2xl font-semibold mb-[2px]">
                                    With
                                </p>
                                <p className="text-4xl font-bold xl:text-5xl opacity-100 my-6">
                                    <img
                                        src={Oppo}
                                        alt="Oppo logo"
                                        style={{
                                            width: "80%",
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
                                    textColor={"text-brandGreen"}
                                />
                            </div>
                        </div>
                        <img
                            src={Image2}
                            alt=""
                            className="2xl:w-[220px] lg:w-[185px] sm:w-[220px] absolute bottom-0 2xl:right-2 lg:right-3 sm:right-3"
                        />
                    </div>

                    {/* third col */}
                    <div className="py-10 pl-5 bg-gradient-to-br from-brandBlue to-brandBlue/70 text-white rounded-3xl relative h-[320px] flex items-start">
                        <div>
                            <div className="mb-4">
                                <p className="mb-[2px] text-white">Enjoy</p>
                                <p className="text-2xl font-semibold mb-[2px]">
                                    With
                                </p>
                                <p className="mb-2 overflow-hidden opacity-100 2xl:-translate-x-8 lg:-translate-x-6 md:-translate-x-3 sm:-translate-x-2">
                                    <img
                                        src={Samsung}
                                        alt="Samsung logo"
                                        className="w-90 h-auto"
                                    />
                                </p>
                                <Button
                                    text="Browse"
                                    bgColor={"bg-white"}
                                    textColor={"text-brandBlue"}
                                />
                            </div>
                        </div>
                        <img
                            src={Image3}
                            alt=""
                            className="w-[200px] absolute bottom-0 right-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Featured2;
