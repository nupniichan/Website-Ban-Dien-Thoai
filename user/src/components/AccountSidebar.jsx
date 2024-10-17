import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail'); // Clear the user email
    sessionStorage.removeItem('userId'); // Clear the user id if stored
    sessionStorage.removeItem('accountName');
    navigate('/user/login'); // Redirect to the login page
  };

  return (
    <div className="flex flex-col h-[650px] w-64 bg-gray-100 p-5 shadow-lg select-none"> {/* Add select-none class */}
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul className="flex-grow">
        <li className={`mb-3 p-2 rounded-lg transition-colors duration-300 ${location.pathname === "/user/profile" ? "bg-blue-200 font-bold text-blue-700" : "hover:bg-blue-100"}`}>
          <Link to="/user/profile">Thông tin tài khoản</Link>
        </li>
        <li className={`mb-3 p-2 rounded-lg transition-colors duration-300 ${location.pathname === "/user/my-orders" ? "bg-blue-200 font-bold text-blue-700" : "hover:bg-blue-100"}`}>
          <Link to="/user/my-orders">Lịch sử giao dịch</Link>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;
