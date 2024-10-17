import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { SearchOutlined, ShoppingCartOutlined, FilterOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import pageName from '../PathNames';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FilterMenu from "../components/Filter"; // Import your FilterMenu component

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false); // State to control filter menu visibility
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${searchQuery}`);
    }
  };
  
  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  return (
    <header className="bg-blue-400 shadow-md sticky top-0 z-100 w-full py-4">
      <div className="container mx-auto flex justify-between items-center max-w-6xl px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="menu-link">
            <h1 className="text-2xl text-white font-bold">SPhoneC</h1>
          </Link>
          <div className="relative flex items-center">
            <Input
              placeholder="Search..."
              className="bg-white border border-white rounded-full text-black py-2 pl-4 pr-10 w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              suffix={
                <SearchOutlined
                  className="text-black text-xl cursor-pointer"
                  onClick={handleSearch}
                />
              }
            />
            <Button
              icon={<FilterOutlined />}
              onClick={toggleFilterMenu}
              className="ml-2 bg-white border border-white text-black rounded-full"
            >
              Filter
            </Button>
            {showFilterMenu && <FilterMenu searchQuery={searchQuery} />} {/* Show the FilterMenu */}
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <Link to={pageName.CART} className="menu-link">
            <ShoppingCartOutlined className="text-white text-2xl" />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
