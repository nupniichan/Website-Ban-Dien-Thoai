import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ onSelect, selectedContent }) => {
  return (
    <div className="sidebar">
      <input type="text" placeholder="Nhập chức năng cần tìm..." className="search-bar" />
      <ul className="sidebar-menu">
        <li className={`menu-item ${selectedContent === 'dashboard' ? 'active' : ''}`} onClick={() => onSelect('dashboard')}>
          <img className="menu-icon" src="src/img/icon/dashboard.png" alt="Dashboard" />
          <span>Dashboard</span>
        </li>
        <li className={`menu-item ${selectedContent === 'product' ? 'active' : ''}`} onClick={() => onSelect('product')}>
          <img className="menu-icon" src="src/img/icon/smartphone.png" alt="Quản lý sản phẩm" />
          <span>Quản lý sản phẩm</span>
        </li>
        <li className={`menu-item ${selectedContent === 'order' ? 'active' : ''}`} onClick={() => onSelect('order')}>
          <img className="menu-icon" src="src/img/icon/checklist.png" alt="Quản lý đơn hàng" />
          <span>Quản lý đơn hàng</span>
        </li>
        <li className={`menu-item ${selectedContent === 'user' ? 'active' : ''}`} onClick={() => onSelect('user')}>
          <img className="menu-icon" src="src/img/icon/user.png" alt="Quản lý người dùng" />
          <span>Quản lý người dùng</span>
        </li>
        <li className={`menu-item ${selectedContent === 'report' ? 'active' : ''}`} onClick={() => onSelect('report')}>
          <img className="menu-icon" src="src/img/icon/statics.png" alt="Báo cáo & thống kê" />
          <span>Báo cáo & thống kê</span>
        </li>
        <li className={`menu-item ${selectedContent === 'review' ? 'active' : ''}`} onClick={() => onSelect('review')}>
          <img className="menu-icon" src="src/img/icon/rating.png" alt="Quản lý đánh giá và bình luận" />
          <span>Quản lý đánh giá và bình luận</span>
        </li>
        <li className={`menu-item ${selectedContent === 'inventory' ? 'active' : ''}`} onClick={() => onSelect('inventory')}>
          <img className="menu-icon" src="src/img/icon/box.png" alt="Quản lý kho hàng" />
          <span>Quản lý kho hàng</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <ul className="sidebar-footer-menu">
          <li className="menu-item">
            <img className="menu-icon" src="src/img/icon/setting.png" alt="Settings" />
            <span>Settings</span>
          </li>
          <li className="menu-item">
            <img className="menu-icon" src="src/img/icon/logout.png" alt="Logout" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
