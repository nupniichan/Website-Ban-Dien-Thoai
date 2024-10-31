import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchOutlined, ShoppingOutlined, MenuOutlined } from "@ant-design/icons"; // Import MenuOutlined
import NeonSign from "../assets/BrandLogos/NeonSign.jsx";
import UserMenu from "../components/UserMenu.jsx";
import PathNames from "../PathNames.js";
import DarkModeBtn from "../shared/DarkModeBtn.jsx";

const MenuItems = [
  {
    id: "1",
    name: "Trang Chủ",
    url: `${PathNames.HOMEPAGE}`,
  },
  {
    id: "2",
    name: "Cửa Hàng",
    url: `${PathNames.PRODUCTS}`,
  },
  {
    id: "3",
    name: "Giới Thiệu",
    url: `${PathNames.ABOUT}`,
  },
  {
    id: "4",
    name: "Hỗ Trợ",
    url: `${PathNames.SUPPORT}`,
  },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State for search bar expansion
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State for mobile check
  const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search-results?query=${searchQuery}`);
        }
    };

    const toggleSearch = () => {
        setIsSearchExpanded((prev) => !prev);
    };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // Function to update the isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40 ">
      <div className="container flex justify-between items-center h-20">
        {/* Logo */}
        <Link to={`${PathNames.HOMEPAGE}`} className="flex items-center gap-4">
          <NeonSign text="PHONY BALONEY" />
        </Link>

        {/* Render Mobile Header */}
        {isMobile ? (
          <>
            {/* Search for mobile */}
            <div className="relative flex-1 mx-4">
              <input
                type="text"
                placeholder="Bạn đang tìm gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`transition-all duration-300 rounded-full px-3 py-1 focus:outline-none dark:bg-gray-900 absolute top-1/2 transform -translate-y-1/2 right-0
                  ${isSearchExpanded
                    ? "w-[300px] border border-gray-500 dark:border-gray-800 dark:bg-gray-800"
                    : "w-0"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <SearchOutlined
                className="text-xl text-gray-600 dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 duration-200 cursor-pointer hover:text-black dark:hover:text-white"
                onClick={toggleSearch}
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button className="md:hidden p-2" onClick={toggleMobileMenu}>
              <MenuOutlined className="text-xl text-gray-600 dark:text-gray-400" />
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="bg-white dark:bg-gray-900 flex flex-col items-center p-4 absolute top-full w-full left-0 shadow-lg h-36">
                {/* Menu items in a row */}
                <div className="flex flex-row gap-4 mb-4">
                  {MenuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.url}
                      className="header-menu-item inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
                      onClick={() => setIsMobileMenuOpen(false)} // Close menu on item click
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* User Menu, Shopping Bag, and Dark Mode Button all in the same row */}
                <div className="flex flex-row items-center gap-4 mb-4">
                  <UserMenu />
                  <button onClick={() => navigate(PathNames.CART)} className="relative p-3 mr-4">
                    <ShoppingOutlined className="text-xl text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white" />
                  </button>
                  <DarkModeBtn />
                </div>
              </div>
            )}
          </>
        ) : (
          // Render Desktop Header
          <>
            {/* Menu items for desktop */}
            <div className="flex items-center gap-4">
              <ul className="flex items-center gap-4">
                {MenuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.url}
                      className="header-menu-item inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search for desktop */}
            <div className="relative flex-1 mx-4">
              <input
                type="text"
                placeholder="Bạn đang tìm gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`transition-all duration-300 rounded-full px-3 py-1 focus:outline-none dark:bg-gray-900 absolute top-1/2 transform -translate-y-1/2 right-0
                  ${isSearchExpanded
                    ? "w-[300px] border border-gray-500 dark:border-gray-800 dark:bg-gray-800"
                    : "w-0"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <SearchOutlined
                className="text-xl text-gray-600 dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 duration-200 cursor-pointer hover:text-black dark:hover:text-white"
                onClick={toggleSearch}
              />
            </div>

            {/* Header right section for desktop only */}
            <div className="flex justify-between items-center gap-4">
              <button className="relative p-3" onClick={() => navigate(PathNames.CART)}>
                <ShoppingOutlined className="text-xl text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white" />
                <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                  4
                </div>
              </button>

              {/* Dark mode toggle */}
              <DarkModeBtn />

              {/* User Menu */}
              <div>
                <UserMenu />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
