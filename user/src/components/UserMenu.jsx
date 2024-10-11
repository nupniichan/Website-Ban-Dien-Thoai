import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";

const UserMenu = () => {
  const [accountName, setAccountName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Track URL changes

  // Fetch user data
  const fetchUserData = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (userEmail) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/email/${userEmail}`);
        const data = await response.json();
        if (response.ok) {
          setAccountName(data.name);
        } else {
          setAccountName(null); // Reset if there's an issue
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    } else {
      setAccountName(null); // Reset if no email
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch on mount and location change
  }, [location]);

  const items = accountName
    ? [] // No dropdown items if user is logged in
    : [
        { label: <Link to="/user/login">Đăng nhập</Link>, key: "1" },
        { label: <Link to="/user/register">Đăng ký</Link>, key: "2" }
      ];

  const handleProfileClick = (e) => {
    if (!accountName) {
      e.preventDefault(); // Prevent the navigation if not logged in
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Account Name Button or Icon */}
      {accountName ? (
        <Link
          to="/user/profile" // Link to profile if logged in
          onClick={handleProfileClick} // Call handleProfileClick to prevent default if not logged in
          className="flex items-center bg-gray-100 rounded-full px-3 py-1 space-x-2 cursor-pointer"
        >
          <UserOutlined className="text-lg" />
          <span className="text-sm text-gray-700">{accountName}</span>
        </Link>
      ) : (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 space-x-2">
            <MenuOutlined className="text-lg" />
            <UserOutlined className="text-lg" />
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export default UserMenu;
