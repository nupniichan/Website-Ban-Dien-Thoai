import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import "../PathNames";

const items = [
    {
        label: <Link to="/signup">Sign Up</Link>,
        key: "0",
    },
    {
        label: <Link to="/login">Log In</Link>,
        key: "1",
    },
];

const UserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Dropdown
            menu={{ items }}
            trigger={["click"]}
            className="border-2 border-[#dddddd] rounded-[30px] p-[0.5rem] cursor-pointer"
        >
            <Link to="#" >
                <Space>
                    <div className="usermenu-icon-container">
                        <MenuOutlined
                            onClick={() => {
                                setIsMenuOpen((value) => !value);
                            }}
                            rotate={isMenuOpen ? 0 : 180}
                        />
                    </div>
                    <div className="usermenu-icon-container">
                        <UserOutlined />
                    </div>
                </Space>
            </Link>
        </Dropdown>
    );
};
export default UserMenu;
