const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  color: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  os: { type: String },
  brand: { type: String },
  description: { type: String },
  image: { type: String }, 
  cauhinh: {
    kichThuocManHinh: { type: String },
    congNgheManHinh: { type: String },
    cameraSau: { type: String },
    cameraTruoc: { type: String },
    chipset: { type: String },
    gpu: { type: String },
    congNgheNFC: { type: String },
    dungLuongRAM: { type: String },
    boNhoTrong: { type: String },
    pin: { type: String },
    theSIM: { type: String },
    doPhanGiaiManHinh: { type: String },
    congSac: { type: String },
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
