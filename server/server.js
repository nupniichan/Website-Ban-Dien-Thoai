const express = require('express');
const cors = require('cors');
const connectDB = require('./module/db.js');
const { loginAdmin } = require('./module/adminLogin.js');
const Product = require('./module/Product.js');
const Counter = require('./module/Counter.js');
const Order = require('./module/Order.js');
const multer = require('multer');
const path = require('path');

const app = express(); // Initialize express app

// Cấu hình multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Thêm timestamp vào tên file
  },
});

const upload = multer({ storage });

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Để truy cập hình ảnh qua đường dẫn

// Kết nối đến MongoDB
connectDB();

// Helper function to adjust product stock
const adjustProductStock = async (items, revert = false) => {
  for (const item of items) {
    const product = await Product.findOne({ id: item.productId });
    if (product) {
      const adjustedQuantity = revert ? product.quantity + item.quantity : product.quantity - item.quantity;
      await Product.findOneAndUpdate(
        { id: item.productId },
        { quantity: adjustedQuantity },
        { new: true }
      );
    }
  }
};

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

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// Create new order and reduce product stock
app.post('/api/orders', async (req, res) => {
  const { customerId, customerName, shippingAddress, items, paymentMethod, totalAmount, status, orderDate, notes } = req.body;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newOrder = new Order({
      id: `OD${String(counter.seq).padStart(3, '0')}`,
      customerId,
      customerName,
      shippingAddress,
      items,
      paymentMethod,
      totalAmount,
      status: status || 'Chờ xác nhận',
      orderDate: orderDate || new Date(),
      notes,
    });

    await newOrder.save();

    // Reduce stock of products
    await adjustProductStock(items);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Update order, adjust stock if necessary
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, items, shippingAddress, orderDate } = req.body;

  try {
    const existingOrder = await Order.findOne({ id });
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If status is 'Cancelled' revert the stock quantities
    if (status === 'Đã hủy' || existingOrder.status !== status) {
      await adjustProductStock(existingOrder.items, true); // Revert the original stock changes
    }

    // If the items in the order have changed, we need to adjust the stock
    if (items && JSON.stringify(items) !== JSON.stringify(existingOrder.items)) {
      await adjustProductStock(existingOrder.items, true); // Revert the old items' stock
      await adjustProductStock(items); // Apply the new items' stock
    }

    // Update order with new status/items
    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { status, items, shippingAddress, orderDate },
      { new: true }
    );

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

// Delete order and revert product stock
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const orderToDelete = await Order.findOne({ id });
    if (!orderToDelete) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Revert the stock for this order
    await adjustProductStock(orderToDelete.items, true);

    // Use deleteOne() to delete the order
    await Order.deleteOne({ id: orderToDelete.id });

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});



// Endpoint để lấy ID tiếp theo
app.get('/api/counter/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: id },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    res.json({ seq: counter.seq });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy ID tiếp theo' });
  }
});

// Thêm sản phẩm
app.post('/api/addProduct', upload.single('image'), async (req, res) => {
  const { name, color, quantity, price, os, brand, description, cauhinh } = req.body;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'productId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newProduct = new Product({
      id: `SP${String(counter.seq).padStart(3, '0')}`,
      name,
      color,
      quantity,
      price,
      os,
      brand,
      description,
      image: req.file ? req.file.path : null,
      cauhinh: JSON.parse(cauhinh),
    });

    await newProduct.save();
    res.status(201).json({ message: 'Sản phẩm đã được thêm thành công!', id: newProduct.id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: err.message });
  }
});

// Hiển thị tất cả sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: err.message });
  }
});

// Sửa thông tin sản phẩm
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (req.file) {
    updateData.image = req.file.path; // Cập nhật đường dẫn hình ảnh nếu có
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate({ id }, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json({ message: 'Sản phẩm đã được cập nhật thành công!', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: err.message });
  }
});

// Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json({ message: 'Sản phẩm đã được xóa thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
  }
});

// Lấy sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
