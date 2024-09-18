const mongoose = require('mongoose');

// Định nghĩa Admin schema và model
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', AdminSchema, 'admin');

// Hàm đăng nhập admin
const loginAdmin = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Admin not found');
    }

    // So sánh mật khẩu trực tiếp
    if (admin.password !== password) {
      throw new Error('Authentication failed');
    }

    return { message: 'Login successful' };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Xuất các hàm cần thiết
module.exports = {
  loginAdmin
};
