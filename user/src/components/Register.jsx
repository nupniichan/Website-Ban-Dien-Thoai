import { useState } from "react";
import axios from "axios";
import { Form, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';

import { useNavigate } from "react-router-dom";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { message, notification } from "antd";

const Register = ({ onRegisterSuccess }) => {
    const [name, setName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dayOfBirth, setDayOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userAvatar, setUserAvatar] = useState(null); // State for user avatar

    // Error state
    const [nameError, setNameError] = useState("");
    const [accountNameError, setAccountNameError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [dayOfBirthError, setDayOfBirthError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigate = useNavigate();
    const auth = getAuth(); // Initialize Firebase Auth

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error messages
        setNameError("");
        setAccountNameError("");
        setGenderError("");
        setAddressError("");
        setPhoneNumberError("");
        setDayOfBirthError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        let isValid = true;

        // Validation logic
        if (!name.trim()) {
            setNameError("Họ tên không được để trống.");
            isValid = false;
        }

        if (!accountName.trim()) {
            setAccountNameError("Tên tài khoản không được để trống.");
            isValid = false;
        }

        if (!gender) {
            setGenderError("Vui lòng chọn giới tính.");
            isValid = false;
        }

        if (!dayOfBirth) {
            setDayOfBirthError("Ngày sinh không được để trống.");
            isValid = false;
        } else {
            const selectedDate = new Date(dayOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for comparison

            if (selectedDate > today) {
                setDayOfBirthError(
                    "Ngày sinh không thể là ngày trong tương lai."
                );
                isValid = false;
            }
        }

        if (!address.trim()) {
            setAddressError("Địa chỉ không được để trống.");
            isValid = false;
        }

        const phonePattern = /^[0-9]{10,11}$/; // Matches 10-11 digit phone numbers
        if (!phonePattern.test(phoneNumber)) {
            setPhoneNumberError("Số điện thoại không hợp lệ (10-11 số).");
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation pattern
        if (!emailPattern.test(email)) {
            setEmailError("Email không hợp lệ.");
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu không khớp.");
            isValid = false;
        }

        if (isValid) {
            try {
                // Create user in Firebase
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredential.user;

                // Send email verification
                await sendEmailVerification(user);
                console.log(
                    "User registered successfully, verification email sent."
                );

                // Prepare user data to send to your server
                const formData = new FormData();
                formData.append("name", name);
                formData.append("accountName", accountName);
                formData.append("gender", gender);
                formData.append("address", address);
                formData.append("phoneNumber", phoneNumber);
                formData.append("dayOfBirth", dayOfBirth);
                formData.append("email", email);
                formData.append("password", password); // Include password here
                formData.append("userId", user.uid); // Include Firebase user ID

                if (userAvatar) {
                    formData.append("userAvatar", userAvatar);
                }

                // Log the FormData
                for (const [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }

                // Send user data to your backend for storage
                await axios.post(
                    "http://localhost:5000/api/register",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // notification.success({
                //     message: 'Thành công',
                //     description: 'Đăng ký thành công!',
                //     duration: 4,
                //     placement: "bottomRight",
                //     pauseOnHover: true
                // });
                message.open({
                    type: "success",
                    content: "Đăng ký thành công!",
                    duration: 4,
                });
                onRegisterSuccess();
                navigate("/login"); // Optionally redirect to the login page after successful registration
            } catch (error) {
                console.error(
                    "Error during registration:",
                    error.response?.data || error.message
                );
                // notification.error({
                //     message: 'Lỗi',
                //     description: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.",
                //     duration: 4,
                //     placement: "bottomRight",
                //     pauseOnHover: true
                // })
                message.open({
                    type: "error",
                    content:
                        "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.",
                    duration: 4,
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className=" p-8 rounded-lg max-w-md w-full text-center">
                {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Đăng ký
                </h2> */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Họ tên:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên người dùng"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {nameError && (
                            <span className="text-red-500 text-xs">
                                {nameError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Tên tài khoản:
                        </label>
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Nhập tên tài khoản"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {accountNameError && (
                            <span className="text-red-500 text-xs">
                                {accountNameError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Giới tính:
                        </label>
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
                        {genderError && (
                            <span className="text-red-500 text-xs">
                                {genderError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Ngày sinh:
                        </label>
                        <input
                            type="date"
                            value={dayOfBirth}
                            onChange={(e) => setDayOfBirth(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {dayOfBirthError && (
                            <span className="text-red-500 text-xs">
                                {dayOfBirthError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Địa chỉ:
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Nhập địa chỉ"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {addressError && (
                            <span className="text-red-500 text-xs">
                                {addressError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Số điện thoại:
                        </label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {phoneNumberError && (
                            <span className="text-red-500 text-xs">
                                {phoneNumberError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {emailError && (
                            <span className="text-red-500 text-xs">
                                {emailError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Mật khẩu:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {passwordError && (
                            <span className="text-red-500 text-xs">
                                {passwordError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Nhập lại mật khẩu:
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {confirmPasswordError && (
                            <span className="text-red-500 text-xs">
                                {confirmPasswordError}
                            </span>
                        )}
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700">
                            Avatar:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUserAvatar(e.target.files[0])}
                            className="mt-1 block w-full text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    {/* <Form.Item
                        label=<p className="block text-sm font-medium text-gray-700">Avatar</p>
                        valuePropName="fileList"
                        // getValueFromEvent={normFile}
                    >
                        <Upload action="/upload.do" listType="picture-card" accept="image/*" onChange={(e) => setUserAvatar(e.target.files[0])}>
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item> */}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
