import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import AccountSidebar from '../components/AccountSidebar.jsx';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/email/${userEmail}`);
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          setError("Error fetching user data");
        }
      } catch (err) {
        console.error("Error fetching user data", err);
        setError("Error fetching user data");
      }
    } else {
      setError("User email not found");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Clear the user email
    localStorage.removeItem('userId'); // Clear the user id if stored
    navigate('/login'); // Redirect to the login page
  };

  // Toggle editing mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle form submission to update user data
  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); // Get the user ID from local storage

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Send updated user data
      });

      const data = await response.json();

      if (response.ok) {
        setIsEditing(false); // Exit edit mode after successful update
        fetchUserData(); // Re-fetch user data to reflect updates
      } else {
        console.error(data.message);
        setError("Error updating user data");
      }
    } catch (error) {
      console.error("Error updating user data", error);
      setError("Error updating user data");
    }
  };

  return (
    <div className="account-container">
      <AccountSidebar />
      <div className="account-main">
        <h1>Thông tin tài khoản</h1>
        {error && <p className="error-message">{error}</p>}
        {userData ? (
          <div className="account-info-card">
            {isEditing ? (
              <form onSubmit={handleUpdateUserData} className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  placeholder="Tên"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                  placeholder="Số điện thoại"
                  required
                />
                <input
                  type="date"
                  name="dayOfBirth"
                  value={userData.dayOfBirth}
                  onChange={(e) => setUserData({ ...userData, dayOfBirth: e.target.value })}
                  required
                />
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  placeholder="Địa chỉ"
                  required
                />
                <input
                  type="text"
                  name="accountName"
                  value={userData.accountName}
                  onChange={(e) => setUserData({ ...userData, accountName: e.target.value })}
                  placeholder="Tên tài khoản"
                  required
                />
                <button type="submit" className="submit-button">Lưu</button>
                <button type="button" onClick={handleEditToggle} className="cancel-button">Hủy</button>
              </form>
            ) : (
              <div className="account-info">
                <p><strong>Tên:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Số điện thoại:</strong> {userData.phoneNumber}</p>
                <p><strong>Ngày sinh:</strong> {userData.dayOfBirth}</p>
                <p><strong>Giới tính:</strong> {userData.gender}</p>
                <p><strong>Địa chỉ:</strong> {userData.address}</p>
                <p><strong>Tên tài khoản:</strong> {userData.accountName}</p>
                <div className="button-container">
                  <button onClick={handleEditToggle} className="edit-button">Sửa thông tin tài khoản</button>
                  <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
