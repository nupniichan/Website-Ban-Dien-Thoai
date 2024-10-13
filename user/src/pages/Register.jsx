import React, { useState } from 'react';
import './Register.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [dayOfBirthError, setDayOfBirthError] = useState('');  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate(); 

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    return emailRegex.test(email);
  };

  const validateDayOfBirth = (dayOfBirth) => {  
    const today = new Date();
    const selectedDate = new Date(dayOfBirth);
    return selectedDate <= today;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/; 
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError('');
    setAccountNameError(''); // Clear accountName error

    setAddressError('');
    setPhoneNumberError('');
    setDayOfBirthError('');  
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (name.trim() === '') {
      setNameError('Vui lòng nhập tên người dùng');
      isValid = false;
    }
    if (accountName.trim() === '') {
      setAccountNameError('Vui lòng nhập tên tài khoản');
      isValid = false;
    }
    if (address.trim() === '') {
      setAddressError('Vui lòng nhập địa chỉ');
      isValid = false;
    }

    if (phoneNumber.trim() === '') {
      setPhoneNumberError('Vui lòng nhập số điện thoại');
      isValid = false;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0912345678)');
      isValid = false;
    }

    if (dayOfBirth.trim() === '') {  
      setDayOfBirthError('Vui lòng chọn ngày sinh');
      isValid = false;
    } else if (!validateDayOfBirth(dayOfBirth)) {  
      setDayOfBirthError('Vui lòng chọn ngày sinh hợp lệ');
      isValid = false;
    }

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

    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu và xác nhận mật khẩu không khớp');
      isValid = false;
    }

    if (isValid) {
      try {
        await axios.post('http://localhost:5000/api/register', {
          name,
          accountName,
          gender,
          address,
          phoneNumber,
          dayOfBirth,  
          email,
          password,
        });

        alert("Đăng ký thành công!");
        navigate('/login');
        
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;

          if (error.response.data.emailExists) {
            setEmailError('Email này đã được sử dụng');
          }

          if (error.response.data.phoneNumberExists) {
            setPhoneNumberError('Số điện thoại này đã được sử dụng');
          }
          
          console.error('Error:', errorMessage);
        } else {
          console.error('Error during registration:', error);
          alert("Đã xảy ra lỗi trong quá trình đăng ký!");
        }
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2 className="register-title">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Họ tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên người dùng"
            />
            {nameError && <span className="error-message">{nameError}</span>}
          </div>
          
          <div className="input-group">
            <label>Tên tài khoản:</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Nhập tên tài khoản"
            />
            {accountNameError && <span className="error-message">{accountNameError}</span>}
          </div>
          <div className="input-group">
            <label>Giới tính:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              value={dayOfBirth}  
              onChange={(e) => setDayOfBirth(e.target.value)}  
            />
            {dayOfBirthError && <span className="error-message">{dayOfBirthError}</span>}
          </div>
          
          <div className="input-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ"
            />
            {addressError && <span className="error-message">{addressError}</span>}
          </div>

          <div className="input-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
            {phoneNumberError && <span className="error-message">{phoneNumberError}</span>}
          </div>

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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          <div className="input-group">
            <label>Nhập lại mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
            {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
          </div>

          <button type="submit" className="register-btn">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default Register;




