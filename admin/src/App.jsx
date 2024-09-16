import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx'
import ProductManagement from './ProductManagement.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

function App() {
  const [selectedContent, setSelectedContent] = useState('dashboard');

  const handleSelect = (content) => {
    setSelectedContent(content);
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className='header'>
      <Header />
      </div>
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <Sidebar onSelect={handleSelect} />
          </nav>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="main-content">
              {selectedContent === 'dashboard' && <Dashboard/>}
              {selectedContent === 'product' && <ProductManagement/>}
              {selectedContent === 'order' && <h1>Quản lý đơn hàng</h1>}
              {selectedContent === 'user' && <h1>Quản lý người dùng</h1>}
              {selectedContent === 'report' && <h1>Báo cáo & thống kê</h1>}
              {selectedContent === 'review' && <h1>Quản lý đánh giá và bình luận</h1>}
              {selectedContent === 'inventory' && <h1>Quản lý kho hàng</h1>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
