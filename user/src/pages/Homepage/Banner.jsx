import { useNavigate } from "react-router-dom";
import PathNames from "../../PathNames";

const Banner = ({ data }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(`${PathNames}/SP023`);
    };
    return (
        <div className="min-h-[550px] flex justify-center items-center py-12">
            <div className="container">
                <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-white rounded-3xl ${data.bgColor}`}
                >
                    {/* first col */}
                    <div className="p-6 sm:p-8">
                        <p className="text-sm">{data.title2}</p>
                        <h1
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="uppercase text-4xl lg:text-7xl font-bold"
                        >
                            {data.title}
                        </h1>
                        <p
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="250"
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                            className="text-sm"
                        >
                            {data.date}
                        </p>
                    </div>

                    {/* second col */}
                    <div
                        className="h-full flex items-center"
                        data-aos="zoom-in"
                        data-aos-duration="500"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        <img
                            src={data.image}
                            alt=""
                            className="scale-125 w-[250px] md:x-[340px] mx-auto drop-shadow-2xl object-cover hover:-translate-y-1 transition-transform duration-200 ease-linear"
                        />
                    </div>

                    {/* third col */}
                    <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                        <p
                            className="font-bold text-xl"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                        >
                            {data.title2}
                        </p>
                        <p
                            className="font-bold text-xl"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                        >
                            {data.title3}
                        </p>
                        <p
                            data-aos="fade-left"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="text-3xl sm:text-5xl font-bold"
                        >
                            {data.discount}
                        </p>
                        <p
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="text-sm tracking-wide leading-5"
                        >
                            {data.title4}
                        </p>
                        <div
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="250"
                            data-aos-once={false}
                            data-aos-anchor-placement="top-bottom"
                        >
                            <button
                                className={`bg-white py-2 px-4 rounded-full text-primary`}
                                onClick={() => handleButtonClick()}
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
