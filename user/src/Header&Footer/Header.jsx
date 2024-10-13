import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Input } from "antd";
import pageName from '../PathNames';

const Header = () => {
  return (
    <header className="bg-blue-400 shadow-md sticky top-0 z-100 w-full py-4">
      <div className="container mx-auto flex justify-between items-center max-w-6xl px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="menu-link">
            <h1 className="text-2xl text-white font-bold">SPhoneC</h1>
          </Link>
          <div className="relative">
            <Input
              placeholder="Search..."
              className="bg-white border border-white rounded-full text-black py-2 pl-4 pr-10 w-96"
            />
            <SearchOutlined className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xl cursor-pointer" />
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
