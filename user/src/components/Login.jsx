import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Đăng nhập thành công!');

        const userResponse = await fetch(`${BASE_URL}/api/users/email/${formData.email}`);
        const userInfo = await userResponse.json();

        sessionStorage.setItem('userEmail', userInfo.email);
        sessionStorage.setItem('userId', userInfo.id);
        sessionStorage.setItem('accountName', userInfo.accountName);
        console.log(userInfo);
        navigate('/');
      } else {
        alert(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Đã xảy ra lỗi');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 text-center text-gray-800">Đăng Nhập</h2>
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
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300">Đăng Nhập</button>
        <p className="text-center mt-4">
          Chưa có tài khoản? <Link to="/user/register" className="text-blue-500 hover:underline">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
};

export default Login