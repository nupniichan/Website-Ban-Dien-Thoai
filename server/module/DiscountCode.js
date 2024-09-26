const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  usageDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  discountRate: { type: Number, required: true },
  applicableCode: { type: String, required: true },
});

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

module.exports = DiscountCode;