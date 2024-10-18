import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error messages

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng nhập thành công!');

        // Store user information in sessionStorage
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('accountName', data.user.accountName);

        // Dispatch custom event to update login state
        window.dispatchEvent(new Event("loginSuccess"));

        // Redirect to the homepage or any other page
        navigate('/');
      } else {
        setErrorMessage(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 text-center text-gray-800">Đăng Nhập</h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300">
          Đăng Nhập
        </button>

        <p className="text-center mt-4">
          Chưa có tài khoản? <Link to="/user/register" className="text-blue-500 hover:underline">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
