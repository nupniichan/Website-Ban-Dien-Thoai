const mongoose = require('mongoose');

const khoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Xuất', 'Nhập'], required: true }, 
  managementPerson: { type: String, required: true }, 
  responsiblePerson: { type: String, required: true }, 
  date: { type: Date, required: true },
  warehouseCode: { type: String, required: true }, 
  location: { type: String, required: true }, 
  notes: { type: String } ,
  products: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true }, 
    color: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
});

const Kho = mongoose.model('Kho', khoSchema);

module.exports = Kho;
