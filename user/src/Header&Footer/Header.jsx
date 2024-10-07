import { Link } from "react-router-dom";
import NeonSign from "../assets/BrandLogos/NeonSign.jsx";
import UserMenu from "../components/UserMenu.jsx";
import PathNames from "../PathNames.js";
import "./Header.css";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const MenuItems = [
    {
        id: "1",
        name: "Home",
        url: `${PathNames.HOMEPAGE}`,
    },
    {
        id: "2",
        name: "Products",
        url: `${PathNames.PRODUCTS}`,
    },
    {
        id: "3",
        name: "About",
        url: `${PathNames.ABOUT}`,
    },
    {
        id: "4",
        name: "Support",
        url: `${PathNames.SUPPORT}`,
    },
];

const Header = () => {
    const [isSearchExpanded, setSearchExpanded] = useState(false);

    const toggleSearch = () => {
        setSearchExpanded((prev) => !prev);
    };

    return (
        <header className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
            <div className="py-4">
                <div className="container flex justify-between items-center">
                    {/* Logo & Menu section */}
                    <div className="flex item-center gap-4">
                        <Link to={`${PathNames.HOMEPAGE}`}>
                            <NeonSign text="PHONY BALONEY" />
                        </Link>

                        {/* Menu items */}
                        <div className="lg-block">
                            <ul className="flex items-center gap-4">
                                {MenuItems.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <Link
                                                to={item.url}
                                                className="inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Header right section */}
                    <div className="flex justify-between items-center gap-4">
                        {/* Search */}
                        <div className="relative group hidden sm:block">
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className={`search-bar transition-all duration-300 rounded-full px-3 py-1 focus:outline-none dark:bg-gray-900
                                    ${isSearchExpanded
                                        ? "w-[300px] border border-gray-500 dark:border-gray-800 dark:bg-gray-800"
                                        : "w-0"
                                }`}
                            />
                            <SearchOutlined
                                className="text-xl text-gray-600 group-hover:text-primary dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 duration-200"
                                onClick={toggleSearch}/>
                        </div>

                        {/* Cart */}

                        {/* User Menu */}
                        <div>
                            <UserMenu />
                        </div>

                        {/* Dark mode toggle */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
