import { useState, useEffect } from 'react';
import AccountSidebar from '../components/AccountSidebar.jsx';
import './MyOrders.css'; // Import the CSS
import { Modal } from 'antd'; // Import Modal from Ant Design
import axios from 'axios'; // Import Axios for API calls

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Display 5 orders per page
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for details
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User is not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/customer/${userId}`);
        if (!response.ok) {
          throw new Error('Error fetching orders');
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched products:', data); // Log the products
          setProducts(data); // Set the products state
        } else {
          console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Call both fetch functions
    fetchOrders();
    fetchProducts();
  }, []);

  // Get current orders for the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show modal with order details
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null); // Clear selected order when modal is closed
  };

  return (
    <div className="account-container">
      <AccountSidebar />
      <div className="account-main">
        <h1>Lịch sử giao dịch</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            {orders.length === 0 ? (
              <p className="no-orders">Bạn không có đơn hàng nào.</p>
            ) : (
              <>
                <ul className="orders-list" style={{ display: 'grid', gridTemplateColumns: 'none' }}>
                  {currentOrders.map((order) => (
                    <li key={order._id} onClick={() => showOrderDetails(order)}>
                      <p><strong>Mã đơn hàng:</strong> {order.id}</p>
                      <p><strong>Tổng giá:</strong> {order.totalAmount} VND</p>
                      <p className="order-status"><strong>Trạng thái:</strong> {order.status}</p>
                      <button className="details-button">Chi tiết đơn hàng</button>
                    </li>
                  ))}
                </ul>

                {/* Pagination controls */}
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </button>
                  <span>Trang {currentPage}</span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastOrder >= orders.length}
                  >
                    Trang sau
                  </button>
                </div>

                {/* Modal for order details */}
                {selectedOrder && (
                  <Modal
                    title={`Chi tiết đơn hàng - ${selectedOrder.id}`}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null} // No footer buttons
                  >
                    <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                    <p><strong>Tổng giá:</strong> {selectedOrder.totalAmount} VND</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}</p>
                    <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                    <p><strong>Ngày đặt hàng:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                    <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                    
                    {/* Table for order items */}
                    <h3>Sản phẩm trong đơn hàng:</h3>
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Mã sản phẩm</th>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => {
                          const product = products.find(prod => prod.id === item.productId); // Get product details using productId
                          return (
                            <tr key={item.productId}>
                              <td>{item.productId}</td>
                              <td>{product ? product.name : 'Unknown Product'}</td> {/* Show product name */}
                              <td>{item.quantity}</td>
                              <td>{product ? product.price : 'N/A'} VND</td> {/* Show product price */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Modal>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
