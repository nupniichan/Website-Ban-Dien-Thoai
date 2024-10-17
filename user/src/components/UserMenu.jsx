import { useEffect, useState } from "react";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import PathNames from "../PathNames.js";

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }

    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };

    // Lắng nghe sự kiện login thành công
    window.addEventListener("loginSuccess", handleLoginSuccess);

    // Xóa sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, []);


  const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi sessionStorage
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("accountName");
    setIsLoggedIn(false);
    navigate(PathNames.HOMEPAGE); // Quay lại trang chủ sau khi đăng xuất
  };

  const GuestItems = [
    {
      label: <Link to={PathNames.REGISTER}>Sign Up</Link>, // Điều hướng đến trang Register
      key: "0",
    },
    {
      label: <Link to={PathNames.LOGIN}>Log In</Link>, // Điều hướng đến trang Login
      key: "1",
    },
  ];

  const UserItems = [
    {
      label: <Link to={PathNames.PROFILE}>Profile</Link>,
      key: "0",
    },
    {
      label: <Link to={PathNames.MY_ORDERS}>My Orders</Link>,
      key: "1",
    },
    {
      label: <p onClick={handleLogout}>Log Out</p>, // Thực hiện đăng xuất
      key: "2",
    },
  ];

  const handleMenuChange = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <>
      {!isLoggedIn ? (
        <Dropdown
          menu={{ items: GuestItems }}
          trigger={["click"]}
          onOpenChange={handleMenuChange}
          className="inline-flex h-[2.8rem] w-[5.05rem] justify-center gap-[0.8rem] border-[1px] border-[#dddddd] rounded-[30px] p-2 m-[2rem] ml-[0.75rem] cursor-pointer transition-shadow duration-150 ease-linear hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] focus:shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
          overlayStyle={{ fontSize: "0.875rem", lineHeight: "1.43" }}
        >
          <Space>
            <MenuOutlined className={`transition-transform duration-200 ease-linear transform ${isMenuOpen ? `rotate-90` : `rotate-0`}`} />
            <UserOutlined />
          </Space>
        </Dropdown>
      ) : (
        <Dropdown
          menu={{ items: UserItems }}
          trigger={["click"]}
          onOpenChange={handleMenuChange}
          className="inline-flex h-[2.8rem] w-[5.05rem] justify-center gap-[0.8rem] border-[1px] border-[#dddddd] rounded-[30px] p-2 m-[2rem] cursor-pointer transition-shadow duration-150 ease-linear hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] focus:shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
          overlayStyle={{ fontSize: "0.875rem", lineHeight: "1.43" }}
        >
          <Space>
            <MenuOutlined className={`transition-transform duration-200 ease-linear transform ${isMenuOpen ? `rotate-90` : `rotate-0`}`} />
            <UserOutlined />
          </Space>
        </Dropdown>
      )}
    </>
  );
};

export default UserMenu;
