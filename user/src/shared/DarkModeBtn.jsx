import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./DarkModeBtn.css";

const DarkModeBtn = () => {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const element = document.documentElement; //Access the root element
    console.log(element);

    // Set the theme to localStorage and root element
    useEffect(() => {
        localStorage.setItem("theme", currentTheme);
        if (currentTheme === "dark") {
            element.classList.add("dark");
            element.classList.add("dark");
        } else {
            element.classList.remove("light");
            element.classList.remove("dark");
        }
    }, [currentTheme, element.classList]);

    return (
        <button
            className="darkmode-btn"
            onClick={() =>
                setCurrentTheme(currentTheme === "dark" ? "light" : "dark")
            }
        >
            <input
                type="checkbox"
                id="darkmode-toggle"
                className="darkmode-btn-toggle"
            />
            <label htmlFor="darkmode-toggle" className="darkmode-btn-label">
                <SunOutlined />
                <MoonOutlined />
            </label>
            <div className="darkmode-btn-bg"></div>
        </button>
    );
};

export default DarkModeBtn;
