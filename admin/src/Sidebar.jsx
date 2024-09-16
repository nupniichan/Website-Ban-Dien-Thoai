import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      <input type="text" placeholder="Nhập chức năng cần tìm..." className="search-bar" />
      <ul className="sidebar-menu">
        <li className="menu-item" onClick={() => onSelect('dashboard')}>
          <img className="menu-icon" src="src/img/icon/dashboard.png" alt="Dashboard" />
          <span>Dashboard</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('product')}>
          <img className="menu-icon" src="src/img/icon/smartphone.png" alt="Quản lý sản phẩm" />
          <span>Quản lý sản phẩm</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('order')}>
          <img className="menu-icon" src="src/img/icon/checklist.png" alt="Quản lý đơn hàng" />
          <span>Quản lý đơn hàng</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('user')}>
          <img className="menu-icon" src="src/img/icon/user.png" alt="Quản lý người dùng" />
          <span>Quản lý người dùng</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('report')}>
          <img className="menu-icon" src="src/img/icon/statics.png" alt="Báo cáo & thống kê" />
          <span>Báo cáo & thống kê</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('review')}>
          <img className="menu-icon" src="src/img/icon/rating.png" alt="Quản lý đánh giá và bình luận" />
          <span>Quản lý đánh giá và bình luận</span>
        </li>
        <li className="menu-item" onClick={() => onSelect('inventory')}>
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
