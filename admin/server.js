const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Web', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Admin model for the "Web" collection
const Admin = mongoose.model('Admin', new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
}), 'Web');

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // If no admin found
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the stored password
    if (password === admin.password) {
      // If the passwords match, return success
      const token = jwt.sign({ email: admin.email }, 'your_jwt_secret', { expiresIn: '1h' });
      return res.json({ message: 'Login successful', token });
    } else {
      // If password is incorrect
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    // If there’s any server error
    return res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));