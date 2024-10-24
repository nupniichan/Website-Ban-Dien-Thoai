import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng nhập thành công!');
        console.log(data)
        console.log(data.user.accountName)
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userId', data.user.userId);
        sessionStorage.setItem('accountName', data.user.accountName);

        window.dispatchEvent(new Event("loginSuccess"));
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
    <div className="flex justify-center items-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full" onSubmit={handleSubmit}>
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
          Chưa có tài khoản? <span className="text-blue-500 hover:underline cursor-pointer" onClick={onSwitchToRegister}>Đăng ký</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
