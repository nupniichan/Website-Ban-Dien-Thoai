const express = require('express');
const cors = require('cors');
const connectDB = require('./module/db.js');
const { loginAdmin } = require('./module/adminLogin.js');
const Product = require('./module/Product.js');
const Counter = require('./module/Counter.js');
const Order = require('./module/Order.js');
const Kho = require('./module/Kho.js');
const User = require('./module/user.js');
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
      cauhinh: JSON.parse(cauhinh),  // Chuyển từ chuỗi JSON sang object
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

  // Nếu có dữ liệu cauhinh, parse chuỗi JSON thành object
  if (updateData.cauhinh) {
    updateData.cauhinh = JSON.parse(updateData.cauhinh);
  }
  if (req.file) {
    updateData.image = req.file.path;
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

// Get all kho entries
app.get('/api/kho', async (req, res) => {
  console.log("Received request to get all kho entries");
  try {
    const khoEntries = await Kho.find();
    console.log("Fetched kho entries:", khoEntries);
    res.json(khoEntries);
  } catch (err) {
    console.error('Error fetching kho entries:', err.message);
    res.status(500).json({ message: 'Error fetching kho entries', error: err.message });
  }
});

// Get kho entry by ID
app.get('/api/kho/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get kho entry with ID: ${id}`);
  try {
    const khoEntry = await Kho.findOne({ id });
    if (!khoEntry) {
      console.warn(`Kho entry with ID ${id} not found`);
      return res.status(404).json({ message: 'Kho entry not found' });
    }
    console.log("Fetched kho entry:", khoEntry);
    res.json(khoEntry);
  } catch (err) {
    console.error('Error fetching kho entry:', err.message);
    res.status(500).json({ message: 'Error fetching kho entry', error: err.message });
  }
});

// Create new kho entry
app.post('/api/kho', async (req, res) => {
  console.log("Received request to create new kho entry:", req.body);
  const { id, type, managementPerson, responsiblePerson, date, warehouseCode, location, notes, products} = req.body;

  const newKhoEntry = new Kho({
    id,
    type,
    managementPerson,
    responsiblePerson,
    date,
    warehouseCode,
    location,
    notes,
    products
  });

  try {
    await newKhoEntry.save();
    console.log("Kho entry created successfully:", newKhoEntry);
    res.status(201).json({ message: 'Kho entry created successfully', khoEntry: newKhoEntry });
  } catch (err) {
    console.error('Error creating kho entry:', err.message);
    res.status(500).json({ message: 'Error creating kho entry', error: err.message });
  }
});

// Update kho entry
app.put('/api/kho/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to update kho entry with ID: ${id}`, req.body);
  const updateData = req.body;

  try {
    const updatedKhoEntry = await Kho.findOneAndUpdate({ id }, updateData, { new: true });
    if (!updatedKhoEntry) {
      console.warn(`Kho entry with ID ${id} not found for update`);
      return res.status(404).json({ message: 'Kho entry not found' });
    }
    console.log("Kho entry updated successfully:", updatedKhoEntry);
    res.json({ message: 'Kho entry updated successfully', khoEntry: updatedKhoEntry });
  } catch (err) {
    console.error('Error updating kho entry:', err.message);
    res.status(500).json({ message: 'Error updating kho entry', error: err.message });
  }
});

// Delete kho entry
app.delete('/api/kho/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete kho entry with ID: ${id}`);

  try {
    const deletedKhoEntry = await Kho.findOneAndDelete({ id });
    if (!deletedKhoEntry) {
      console.warn(`Kho entry with ID ${id} not found for deletion`);
      return res.status(404).json({ message: 'Kho entry not found' });
    }
    console.log("Kho entry deleted successfully:", deletedKhoEntry);
    res.json({ message: 'Kho entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting kho entry:', err.message);
    res.status(500).json({ message: 'Error deleting kho entry', error: err.message });
  }
});


// Hiển thị tất cả người dùng
app.get('/api/users', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: err.message });
  }
});

// generate unique ID cho User (dạng KHxxx)
const generateCustomerId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'customerId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `KH${String(counter.seq).padStart(3, '0')}`;
};

// Thêm người dùng mới
app.post('/api/addUser', async (req, res) => {
  const { name, email, phoneNumber, dayOfBirth, gender, address, accountName, password, role } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo ID cho khách hàng mới
    const userId = await generateCustomerId();

    // Tạo người dùng mới
    const newUser = new User({
      id: userId,
      name,
      email,
      phoneNumber,
      dayOfBirth,
      gender,
      address,
      accountName,
      password, 
      role: role || 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'Người dùng đã được thêm thành công', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm người dùng', error: err.message });
  }
});

// Sửa thông tin người dùng
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, dayOfBirth, gender, address, accountName, password, role } = req.body;

  try {
    const updateData = { name, email, phoneNumber, dayOfBirth, gender, address, accountName, password, role };

    const updatedUser = await User.findOneAndUpdate({ id }, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json({ message: 'Người dùng đã được cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});

// Xóa người dùng
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ id });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json({ message: 'Người dùng đã được xóa thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
});

// Lấy danh sách tất cả người dùng
app.post('/api/users', async (req, res) => {
  const { name, email, phoneNumber, dayOfBirth, gender, address, accountName, password, role } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo ID cho khách hàng mới
    const userId = await generateCustomerId();

    // Tạo người dùng mới với tất cả các trường
    const newUser = new User({
      id: userId,
      name,
      email,
      phoneNumber,
      dayOfBirth, 
      gender,     
      address,     
      accountName, 
      password, 
      role: role || 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'Người dùng đã được thêm thành công', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm người dùng', error: err.message });
  }
});


// Lấy thông tin người dùng theo ID
app.put('/api/users/:id', async (req, res) => {
  const { name, email, phoneNumber, dayOfBirth, gender, address, accountName, password, role } = req.body;

  try {
    const updateData = { 
      name, 
      email, 
      phoneNumber,    
      dayOfBirth,     
      gender,       
      address, 
      accountName, 
      password, 
      role 
    };

    const updatedUser = await User.findOneAndUpdate({ id }, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json({ message: 'Người dùng đã được cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
