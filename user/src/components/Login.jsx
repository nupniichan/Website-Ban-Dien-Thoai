import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    auth,
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "../firebase";
import { BASE_URL } from "../config";

const Login = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setResendMessage("");
        setShowResend(false);

        try {
            // Firebase sign-in
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // Check if the user's email is verified
            if (!user.emailVerified) {
                setErrorMessage(
                    "Vui lòng xác minh email của bạn trước khi đăng nhập."
                );
                setShowResend(true);
                return;
            }

            // Send a request to the backend API for additional user data
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }), // You may adjust this depending on your backend logic
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("userEmail", formData.email);
                sessionStorage.setItem("userId", data.user.userId); // Ensure your backend sends this in the response
                sessionStorage.setItem("accountName", data.user.accountName); // Ensure your backend sends this in the response
                window.dispatchEvent(new Event("loginSuccess"));
                navigate("/");
                console.log("Logged in successfully with user data:", data);
            } else {
                const errorData = await response.json();
                setErrorMessage(
                    errorData.message || "Email hoặc mật khẩu không chính xác"
                );
            }
        } catch (err) {
            console.error("Error:", err);
            setErrorMessage("Email hoặc mật khẩu không chính xác");
        }
    };
    
    const handleResendVerification = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await sendEmailVerification(user);
                setResendMessage(
                    "Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư đến của bạn."
                );
            }
        } catch (err) {
            console.error("Error resending verification email:", err);
            setResendMessage(
                "Đã xảy ra lỗi khi gửi lại email xác minh. Vui lòng thử lại sau."
            );
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 ">
            <form
                className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl mb-6 text-center text-gray-800">
                    Đăng Nhập
                </h2>

                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">
                        {errorMessage}
                    </p>
                )}
                {resendMessage && (
                    <p className="text-green-500 text-center mb-4">
                        {resendMessage}
                    </p>
                )}

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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
                >
                    Đăng Nhập
                </button>

                {showResend && (
                    <button
                        type="button"
                        onClick={handleResendVerification}
                        className="w-full bg-yellow-500 text-white mt-4 p-3 rounded hover:bg-yellow-600 transition duration-300"
                    >
                        Gửi lại Email Xác Minh
                    </button>
                )}

                <p className="text-center mt-4">
                    Chưa có tài khoản?{" "}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={onSwitchToRegister}
                    >
                        Đăng ký
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
