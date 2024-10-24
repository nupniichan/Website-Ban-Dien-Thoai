const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true }, 
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: 'Chờ xác nhận' },
  orderDate: { type: Date, required: true, default: Date.now }, 
  notes: { type: String },
});

orderSchema.pre('save', function(next) {
  if (this.totalAmount < 0) {
    return next(new Error('Tổng số tiền không thể âm'));
  }
  if (!['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'].includes(this.status)) {
    return next(new Error('Trạng thái đơn hàng không hợp lệ'));
  }
  if (!this.items || this.items.length === 0) {
    return next(new Error('Đơn hàng phải có ít nhất một sản phẩm'));
  }
  if (!this.shippingAddress || this.shippingAddress.trim().length === 0) {
    return next(new Error('Địa chỉ giao hàng không được để trống'));
  }
  if (!['COD', 'MoMo', 'Bank Transfer'].includes(this.paymentMethod)) {
    return next(new Error('Phương thức thanh toán không hợp lệ'));
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
