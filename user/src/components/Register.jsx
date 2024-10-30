import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);  // State for user avatar

  // Error state
  const [nameError, setNameError] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [dayOfBirthError, setDayOfBirthError] = useState('');  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setNameError('');
    setAccountNameError('');
    setGenderError('');
    setAddressError('');
    setPhoneNumberError('');
    setDayOfBirthError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    // Validation logic
    if (!name.trim()) {
      setNameError('Họ tên không được để trống.');
      isValid = false;
    }

    if (!accountName.trim()) {
      setAccountNameError('Tên tài khoản không được để trống.');
      isValid = false;
    }

    if (!gender) {
      setGenderError('Vui lòng chọn giới tính.');
      isValid = false;
    }

    if (!dayOfBirth) {
      setDayOfBirthError('Ngày sinh không được để trống.');
      isValid = false;
    } else {
      const selectedDate = new Date(dayOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for comparison

      if (selectedDate > today) {
        setDayOfBirthError('Ngày sinh không thể là ngày trong tương lai.');
        isValid = false;
      }
    } 

    if (!address.trim()) {
      setAddressError('Địa chỉ không được để trống.');
      isValid = false;
    }

    const phonePattern = /^[0-9]{10,11}$/;  // Matches 10-11 digit phone numbers
    if (!phonePattern.test(phoneNumber)) {
      setPhoneNumberError('Số điện thoại không hợp lệ (10-11 số).');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email validation pattern
    if (!emailPattern.test(email)) {
      setEmailError('Email không hợp lệ.');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp.');
      isValid = false;
    }

    if (isValid) {
      try {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('accountName', accountName);
          formData.append('gender', gender);
          formData.append('address', address);
          formData.append('phoneNumber', phoneNumber);
          formData.append('dayOfBirth', dayOfBirth);
          formData.append('email', email);
          formData.append('password', password);
          if (userAvatar) {
              formData.append('userAvatar', userAvatar);
          }

          // Log the FormData
          for (const [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
          }

          await axios.post('http://localhost:5000/api/register', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });

          alert("Đăng ký thành công!");
          onRegisterSuccess();
      } catch (error) {
          console.error("Error during registration:", error.response?.data || error.message);
          alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center transition-transform hover:translate-y-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Họ tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {nameError && <span className="text-red-500 text-xs">{nameError}</span>}
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Tên tài khoản:</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Nhập tên tài khoản"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {accountNameError && <span className="text-red-500 text-xs">{accountNameError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Giới tính:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {genderError && <span className="text-red-500 text-xs">{genderError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Ngày sinh:</label>
            <input
              type="date"
              value={dayOfBirth}  
              onChange={(e) => setDayOfBirth(e.target.value)}  
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {dayOfBirthError && <span className="text-red-500 text-xs">{dayOfBirthError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {addressError && <span className="text-red-500 text-xs">{addressError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Allow only numbers
              placeholder="Nhập số điện thoại"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {phoneNumberError && <span className="text-red-500 text-xs">{phoneNumberError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {emailError && <span className="text-red-500 text-xs">{emailError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Nhập lại mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {confirmPasswordError && <span className="text-red-500 text-xs">{confirmPasswordError}</span>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700">Avatar:</label>
            <input
              type="file"
              accept="image/*"  // Accept image files only
              onChange={(e) => setUserAvatar(e.target.files[0])} // Set the selected file
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transform hover:translate-y-1 mt-4">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
