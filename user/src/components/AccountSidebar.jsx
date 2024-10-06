import { Link, useLocation } from "react-router-dom";
import "./AccountSidebar.css";

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul>
        <li className={`sidebar-item ${location.pathname === "/user/profile" ? "active" : ""}`}>
          <Link to="/user/profile">Thông tin tài khoản</Link>
        </li>
        <li className={`sidebar-item ${location.pathname === "/user/my-orders" ? "active" : ""}`}>
          <Link to="/user/my-orders">Lịch sử giao dịch</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
