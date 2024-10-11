import React, { useState } from 'react';
import axios from 'axios'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    let isValid = true;

    
    if (email.trim() === '') {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Vui lòng nhập email hợp lệ (ví dụ: abcd@gmail.com)');
      isValid = false;
    }

    
    if (password.trim() === '') {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          email,
          password,
        });

        
        if (response.status === 200) {
          alert('Đăng nhập thành công!'); 
          
          console.log('User data:', response.data);
        } else {
          alert('Đăng nhập thất bại!'); 
        }
      } catch (error) {
        console.error('Error during login:', error.response.data); 
        alert('Đã xảy ra lỗi trong quá trình đăng nhập!'); 
      }
    } 
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="text"  
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <div className="input-group">
            <label>Mật khẩu:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>
          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Hiện mật khẩu</label>
          </div>
          <button type="submit" className="login-btn">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;