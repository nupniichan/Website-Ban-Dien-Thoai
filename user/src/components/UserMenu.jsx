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
            className="gap-[0.25rem] border-[1px] border-[#dddddd] rounded-[30px] p-[0.5rem] m-[2rem] cursor-pointer"
            overlayStyle={{ fontSize: "0.875rem", lineHeight: "1.43" }}
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
