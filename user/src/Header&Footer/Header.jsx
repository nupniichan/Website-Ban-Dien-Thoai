import { Link } from "react-router-dom";
import NeonSign from "../components/BrandLogos/NeonSign";
import UserMenu from "../components/UserMenu";
import "./Header.css";

const Header = () => {
    return (
        // <header className="fixed top-0 w-full shadow-md z-50">
        //     <div className="header-content-container flex items-center flex-wrap lg:justify-center gap-4  border-b min-h-[75px]">
        //         <div className="header-left text-orange-600">left section</div>
        //             <NeonSign text="PHONY BALONEY" />
        //         <div className="header-right text-orange-600">right section</div>
        //     </div>
        // </header>

        <header>
            <div>
                <div className="container">
                    {/* Logo and Links section */}
                    <div>
                        <Link to="#" className="">
                            <NeonSign text="PHONY BALONEY" />
                        </Link>
                    </div>

                    {/* User menu and search section */}
                </div>
            </div>
        </header>
    );
};

export default Header;
