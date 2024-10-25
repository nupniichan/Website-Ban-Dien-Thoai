import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountSidebar from '../components/AccountSidebar.jsx';
import { BASE_URL } from "../config.js";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userAvatar, setUserAvatar] = useState(); // State for user avatar upload
  const [avatarPreview, setAvatarPreview] = useState(null); // State for avatar preview
  const [avatarError, setAvatarError] = useState(''); // State for avatar error
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/email/${userEmail}`);
        const data = await response.json();
        console.log(data); // Log the fetched data
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setUserAvatar(null); // Reset userAvatar when editing is toggled off
      setAvatarPreview(null); // Reset avatar preview when editing is toggled off
      setAvatarError(''); // Reset avatar error when editing is toggled off
    }
  };

  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');

    const formData = new FormData(); // Create FormData to handle file uploads
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('dayOfBirth', userData.dayOfBirth);
    formData.append('gender', userData.gender);
    formData.append('address', userData.address);
    formData.append('accountName', userData.accountName);
    console.log([...formData]); // Log FormData entries

    if (userAvatar) {
      formData.append('avatar', userAvatar); // Append the avatar file
    }
    console.log(userAvatar)

    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        setIsEditing(false);
        fetchUserData();
        setUserAvatar(null); // Reset userAvatar after successful update
        setAvatarPreview(null); // Reset avatar preview after successful update
      } else {
        console.error(data.message);
        setError("Error updating user data");
      }
    } catch (error) {
      console.error("Error updating user data", error);
      setError("Error updating user data");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // Limit to 2MB
        setAvatarError('File size exceeds 2MB limit');
        return;
      }
      setUserAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Create a preview URL for the selected file
      setAvatarError(''); // Clear any previous error
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
            <label className="font-medium">Avatar:</label>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange} // Update avatar and preview
                    className="border rounded-lg p-2"
                  />
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover" // object-cover to maintain aspect ratio
                    />
                  )}
                </>
              ) : (
                <img
                  src={`${BASE_URL}/${userData.userAvatar.replace(/\\/g, '/')}`}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover" // object-cover for better aspect ratio handling
                />
              )}
            </div>
          </div>

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
