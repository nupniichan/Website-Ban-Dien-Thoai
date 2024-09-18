const express = require('express');
const cors = require('cors');
const connectDB = require('./module/db.js'); // Sử dụng connectDB từ db.js
const { loginAdmin } = require('./module/adminLogin.js'); // Sử dụng module đăng nhập

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json()); 

// Kết nối đến MongoDB
connectDB();

// Login endpoint
app.post('/loginAdmin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginAdmin(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
