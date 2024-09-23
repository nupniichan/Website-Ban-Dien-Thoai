const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // thêm ID sản phẩm
  name: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  os: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  cauhinh: { // Thêm cấu hình sản phẩm
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
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
