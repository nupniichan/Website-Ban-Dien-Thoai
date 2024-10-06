import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./Header.css";
import { Input } from "antd";

const Header = () => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo-and-search">
        <Link to="/" className="menu-link"><h1 className="logo">SPhoneC</h1></Link>
          <div className="search-bar">
            <Input
              placeholder="Search..."
              className="search-input"
            />
            <SearchOutlined className="search-icon" />
          </div>
        </div>
        <div className="menu-items">
          <Link to="/user/cart" className="menu-link">
            <ShoppingCartOutlined className="icon" />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
