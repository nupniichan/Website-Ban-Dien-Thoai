import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import ProductManagement from './ProductManagement.jsx';
import OrderManagement from './OrderManagement.jsx';
import AdminLogin from './AdminLogin.jsx';
import UserManagement from './UserManagement.jsx';
import InventoryManagement from './InventoryManagement.jsx';
import ReviewManagement from './ReviewManagement.jsx';
import Statistics from './Statistics.jsx';
import AddProduct from './AddProduct.jsx';
import EditProduct from './EditProduct.jsx';
import AddOrder from './AddOrder.jsx';
import EditOrder from './EditOrder.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedContent, setSelectedContent] = useState('dashboard');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSidebarNavigation = (content) => {
    setSelectedContent(content);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <div className="header">
          <Header />
        </div>
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
              <Sidebar selectedContent={selectedContent} onNavigate={handleSidebarNavigation} />
            </nav>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/product-management" element={<ProductManagement />} />
                  <Route path="/order-management" element={<OrderManagement />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/edit-product/:productId" element={<EditProduct />} />
                  <Route path="/add-order" element={<AddOrder />} />
                  <Route path="/edit-order/:orderId" element={<EditOrder />} />
                  <Route path="/user-management" element={<h1>Quản lý người dùng</h1>} />
                  <Route path="/reports" element={<h1>Báo cáo & thống kê</h1>} />
                  <Route path="/reviews" element={<h1>Quản lý đánh giá và bình luận</h1>} />
                  <Route path="/inventory-management" element={<h1>Quản lý kho hàng</h1>} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;