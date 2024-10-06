// Register.js
import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dayOfBirth: '',
    gender: '',
    address: '',
    accountName: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công!');
            navigate('/user/login');
      } else {
        alert(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Đã xảy ra lỗi');
    }
  };

  return (
    <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Đăng Ký</h2>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
            />
            <input
                type="date"
                name="dayOfBirth"
                placeholder="Date of Birth"
                value={formData.dayOfBirth}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="accountName"
                placeholder="Account Name"
                value={formData.accountName}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />
            <button type="submit">Đăng Ký</button>
            <p>Đã có tài khoản? <Link to="/user/login">Đăng nhập</Link></p>
        </form>
    </div>
);
};

export default Register;
