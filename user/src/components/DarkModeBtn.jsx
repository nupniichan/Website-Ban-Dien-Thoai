
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import "./DarkModeBtn.css";

const DarkModeBtn = () => {
    return (
        <button className="darkmode-btn">
            <input type="checkbox" id="darkmode-toggle" className="darkmode-btn-toggle"/>
            <label htmlFor="darkmode-toggle" className="darkmode-btn-label"><SunOutlined /><MoonOutlined /></label>

            <div className="darkmode-btn-bg">
            </div>
        </button>
    );
};

export default DarkModeBtn;
