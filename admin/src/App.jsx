import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductManagement from './pages/ProductManagement/ProductManagement.jsx';
import OrderManagement from './pages/OrderManagement/OrderManagement.jsx';
import AdminLogin from './AdminLogin.jsx';
import UserManagement from './pages/UserManagement/UserManagement.jsx';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx';
import ReviewManagement from './pages/ReviewManagement/ReviewManagement.jsx';
import Statistics from './pages/Statistics.jsx';
import AddProduct from './pages/ProductManagement/AddProduct.jsx';
import EditProduct from './pages/ProductManagement/EditProduct.jsx';
import AddOrder from './pages/OrderManagement/AddOrder.jsx';
import EditOrder from './pages/OrderManagement/EditOrder.jsx';
import VoucherManagement from './pages/VoucherManagement/VoucherManagement.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';
import AddVoucher from './pages/VoucherManagement/AddVoucher.jsx';
import EditVoucher from './pages/VoucherManagement/EditVoucher.jsx';
import AddUser from './pages/UserManagement/AddUser.jsx';


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
                  <Route path="/dashboard" element= <Dashboard /> />
                  <Route path="/product-management" element= <ProductManagement /> />
                  <Route path="/order-management" element= <OrderManagement /> />
                  <Route path="/add-product" element= <AddProduct /> />
                  <Route path="/edit-product/:productId" element= <EditProduct /> />
                  <Route path="/add-order" element= <AddOrder /> />
                  <Route path="/edit-order/:orderId" element= <EditOrder /> />
                  <Route path="/user-management" element= <UserManagement /> />
                  <Route path="/add-user" element= <AddUser /> />
                  <Route path="/voucher-management" element= <VoucherManagement /> />
                  <Route path="/add-voucher" element= <AddVoucher /> />
                  <Route path="/edit-voucher/:voucherId" element= <EditVoucher /> />
                  <Route path="/reports" element= <Statistics /> />
                  <Route path="/reviews" element= <ReviewManagement/> />
                  <Route path="/inventory-management" element= <InventoryManagement /> />
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