import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import AccountSidebar from '../components/AccountSidebar.jsx';
import { BASE_URL } from "../config.js";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchUserData = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/email/${userEmail}`);
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

  // Toggle editing mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle form submission to update user data
const handleUpdateUserData = async (e) => {
  e.preventDefault();
  const userId = sessionStorage.getItem('userId');

  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send updated user data
    });

    const data = await response.json();

    if (response.ok) {
      setIsEditing(false); // Exit edit mode after successful update
      sessionStorage.setItem('userEmail', userData.email); // Update the session with the new email
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
    <div className="flex flex-col md:flex-row h-[690px] bg-gray-100 p-5">
      <AccountSidebar />
      <div className="flex-1 ml-0 md:ml-10 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Thông tin tài khoản</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userData ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-medium">Tên:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-1/2"
                    name="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Tên"
                    required
                  />
                ) : (
                  <p>{userData.name}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
              <label className="font-medium">Email:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="border rounded-lg p-2 w-1/2"
                        name="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Email"
                        required
                      />
                    ) : (
                      <p>{userData.email}</p>
                    )}
                  </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">Số điện thoại:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-1/2"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                    placeholder="Số điện thoại"
                    required
                  />
                ) : (
                  <p>{userData.phoneNumber}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">Ngày sinh:</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="border rounded-lg p-2 w-1/2"
                    name="dayOfBirth"
                    value={userData.dayOfBirth}
                    onChange={(e) => setUserData({ ...userData, dayOfBirth: e.target.value })}
                    required
                  />
                ) : (
                  <p>{userData.dayOfBirth}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">Giới tính:</label>
                {isEditing ? (
                  <select
                    className="border rounded-lg p-2 w-1/2"
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
                ) : (
                  <p>{userData.gender}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">Địa chỉ:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-1/2"
                    name="address"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    placeholder="Địa chỉ"
                    required
                  />
                ) : (
                  <p>{userData.address}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">Tên tài khoản:</label>
                <p>{userData.accountName}</p> {/* Always displayed as plain text */}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateUserData}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Sửa thông tin tài khoản
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
