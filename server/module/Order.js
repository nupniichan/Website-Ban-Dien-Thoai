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

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
