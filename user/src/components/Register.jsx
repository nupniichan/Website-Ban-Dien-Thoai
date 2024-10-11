import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 text-center text-gray-800">Đăng Ký</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
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
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="date"
          name="dayOfBirth"
          placeholder="Date of Birth"
          value={formData.dayOfBirth}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="accountName"
          placeholder="Account Name"
          value={formData.accountName}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300">Đăng Ký</button>
        <p className="text-center mt-4">
          Đã có tài khoản? <Link to="/user/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
