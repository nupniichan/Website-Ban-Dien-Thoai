import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [accountName, setAccountName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Use the location hook to track URL changes

  // Function to fetch user data
  const fetchUserData = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/email/${userEmail}`);
        const data = await response.json();
        if (response.ok) {
          setAccountName(data.accountName);
        } else {
          setAccountName(null); // Reset if there's an issue
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    } else {
      setAccountName(null); // If no email, reset accountName
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on mount and when location changes
  }, [location]); // Depend on location to refetch data when navigating back to this page

  const items = accountName
    ? [] // No dropdown items if user is logged in
    : [
        { label: <Link to="/user/login">Đăng nhập</Link>, key: "1" },
        { label: <Link to="/user/register">Đăng ký</Link>, key: "2" }
      ];

  // Handle profile navigation only if logged in
  const handleProfileClick = (e) => {
    if (!accountName) {
      e.preventDefault(); // Prevent the navigation if not logged in
    }
  };

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      className="border-2 border-[#dddddd] rounded-[30px] p-[0.5rem] cursor-pointer"
    >
      <Link
        to={accountName ? "/user/profile" : "#"} // Only link to profile if logged in
        onClick={handleProfileClick} // Call handleProfileClick to prevent default
      >
        <Space>
          <div className="icon">
            {accountName ? (
              <span>{accountName}</span> // Display accountName when logged in
            ) : (
              <MenuOutlined />
            )}
          </div>
          <div className="icon">
            <UserOutlined />
          </div>
        </Space>
      </Link>
    </Dropdown>
  );
};

export default UserMenu;
