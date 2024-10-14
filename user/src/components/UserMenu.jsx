import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import PathNames from "../PathNames.js";
import Login from "./Login.jsx";

const UserMenu = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // TODO: Navigation for UserMenu
    // TODO: Login, SignUp, Logout
    const GuestItems = [
        {
            label: <p>Sign Up</p>,
            key: "0",
        },
        {
            label: <p>Log In</p>,
            key: "1",
        },
    ];

    const UserItems = [
        {
            label: <Link to={`${PathNames.PROFILE}`}>Profile</Link>,
            key: "0",
        },
        {
            label: <Link to={`${PathNames.MY_ORDERS}`}>My Orders</Link>,
            key: "1",
        },
        {
            label: <Link to="/logout">Log Out</Link>,
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
                        <div className="usermenu-icon-container">
                            <MenuOutlined
                                className={`transition-transform duration-200 ease-linear transform ${isMenuOpen ? `rotate-90` : `rotate-0`}`}
                            />
                        </div>
                        <div className="usermenu-icon-container">
                            <UserOutlined />
                        </div>
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
                        <div className="usermenu-icon-container">
                            <MenuOutlined
                                className={`transition-transform duration-200 ease-linear transform ${isMenuOpen ? `rotate-90` : `rotate-0`}`}
                            />
                        </div>
                        <div className="usermenu-icon-container">
                            <UserOutlined />
                        </div>
                    </Space>
                </Dropdown>
            )}
        </>
    );
};

export default UserMenu;
