const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  dayOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  accountName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  cart: [
    {
      productId: String,
      name: String,
      price: Number,
      color: String,
      quantity: Number,
      image: String, 
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
