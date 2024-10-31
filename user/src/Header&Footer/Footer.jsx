import {
    AmazonOutlined,
    FacebookOutlined,
    InstagramOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import PathNames from "../PathNames.js";
import LocationArrow from "../assets/svg/LocationArrow.jsx";

const FooterLinks = [
    {
        label: "Home",
        link: `${PathNames.HOMEPAGE}`,
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), // Scrolls to top on click
    },
    {
        label: "About",
        link: `${PathNames.ABOUT}`,
    },
    {
        label: "Stories",
        link: `${PathNames.STORIES}`,
    },
    {
        label: "Vacancies",
        link: `${PathNames.VACANCIES}`,
    },
];

const SupportLinks = [
    {
        label: "FAQ",
        link: `${PathNames.FAQ}`,
    },
    {
        label: "Contact Us",
        link: `${PathNames.CONTACTUS}`,
    },
    {
        label: "Privacy Policy",
        link: `${PathNames.PRIVACYPOLICY}`,
    },
    {
        label: "Terms & Conditions",
        link: `${PathNames.TERMS}`,
    },
];

const Footer = () => {
    return (
        <footer className="dark:bg-gray-950">
            <div className="container">
                <div className="grid md:grid-cols-3 pb-14 pt-5">
                    {/* company details */}
                    <div className="py-8 px-4">
                        <Link
                            to="#"
                            className="text-primary font-bold tracking-widest text-2xl uppercase sm:text-3xl"
                        >
                            SPhoneC
                        </Link>
                        <p className="text-gray-600 dark:text-white/70 lg:pr-24 pt-3">
                            Your one-stop shop for smartphones that are almost
                            as good as the real thing.
                        </p>
                        {/* <p className="text-gray-500 mt-4">
                            Beautifully cooked with love by <span className="text-primary">Sphonec</span>
                        </p> */}
                    </div>

                    {/* footer links */}
                    <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
                        <div className="py-8 px-4">
                            <h1 className="text-xl font-bold sm:text-left mb-3">
                                Navigations
                            </h1>
                            <ul className="space-y-3">
                                {FooterLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            onClick={link.onClick} // Scroll to top when Home is clicked
                                            className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* footer second col of links */}
                        <div className="py-8 px-4">
                            <h1 className="text-xl font-bold sm:text-left mb-3">
                                Support
                            </h1>
                            <ul className="space-y-3">
                                {SupportLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* company  addresses */}
                        <div className="py-8 px-4 col-span-2 sm:col-auto">
                            <h1 className="text-xl font-bold sm:text-left mb-3">
                                Connect
                            </h1>
                            <div>
                                <div className="flex items-center gap-3">
                                    <LocationArrow />
                                    <p>Sư Vạn Hạnh, TP. Hồ Chí Minh</p>
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <MobileOutlined />
                                    <p>+84 947500422</p>
                                </div>

                                {/* social links */}
                                <div className="flex item-center gap-3 mt-6">
                                    <Link to={`#`}>
                                        <InstagramOutlined className="text-3xl hover:text-primary duration-300" />
                                    </Link>
                                    <Link to={`#`}>
                                        <FacebookOutlined className="text-3xl hover:text-primary duration-200" />
                                    </Link>
                                    <Link to={`#`}>
                                        <AmazonOutlined className="text-3xl hover:text-primary duration-200" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
