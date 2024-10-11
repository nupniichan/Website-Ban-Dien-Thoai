// Login.js
import { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
const Login = () => {
  const [formData, setFormData] = useState({
    email: '', // Change from accountName to email
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
  
        // Fetch user details after login
        const userResponse = await fetch(`${BASE_URL}/api/users/email/${formData.email}`);
        const userInfo = await userResponse.json();
  
        // Store user info in localStorage
        sessionStorage.setItem('userEmail', userInfo.email);
        sessionStorage.setItem('userId', userInfo.id); // Save the user's id as well
        sessionStorage.setItem('accountName', userInfo.accountName)
        console.log(userInfo)
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
    <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Đăng Nhập</h2>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Đăng Nhập</button>
            <p>Chưa có tài khoản? <Link to="/user/register">Đăng ký</Link></p>
        </form>
    </div>
  );
};

export default Login;
