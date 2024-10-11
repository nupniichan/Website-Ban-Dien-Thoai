import { useState, useEffect } from 'react';
import AccountSidebar from '../components/AccountSidebar.jsx';
import { Modal } from 'antd'; // Import Modal from Ant Design
import axios from 'axios'; // Import Axios for API calls

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(3); // Display 5 orders per page
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for details
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = sessionStorage.getItem('userId');
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
    <div className="flex flex-col md:flex-row h-[690px] bg-gray-100 p-5">
      <AccountSidebar />
      <div className="flex-1 ml-0 md:ml-10 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Lịch sử giao dịch</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <>
            {orders.length === 0 ? (
              <p className="text-center text-lg">Bạn không có đơn hàng nào.</p>
            ) : (
              <>
                <ul className="grid gap-5">
                  {currentOrders.map((order) => (
                    <li
                      key={order._id}
                      className="bg-gray-50 border border-gray-300 p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => showOrderDetails(order)}
                    >
                      <p><strong>Mã đơn hàng:</strong> {order.id}</p>
                      <p><strong>Tổng giá:</strong> {order.totalAmount} VND</p>
                      <p><strong>Trạng thái:</strong> {order.status}</p>
                      <button className="mt-4 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">
                        Chi tiết đơn hàng
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                  >
                    Trang trước
                  </button>
                  <span>Trang {currentPage}</span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastOrder >= orders.length}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
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
                    className="rounded-lg"
                    style={{ top: '20px' }} // Position it higher on the page
                  >
                    <div className="p-6 bg-white rounded-lg shadow-lg"> {/* Added padding and background */}
                      <p className="text-lg font-bold mb-2">
                        <strong>Mã đơn hàng:</strong> {selectedOrder.id}
                      </p>
                      <p className="text-lg font-bold mb-2">
                        <strong>Tổng giá:</strong> {selectedOrder.totalAmount} VND
                      </p>
                      <p className="text-lg font-bold mb-2">
                        <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
                      </p>
                      <p className="text-lg font-bold mb-2">
                        <strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}
                      </p>
                      <p className="text-lg font-bold mb-2">
                        <strong>Ngày đặt hàng:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold mb-4">
                        <strong>Trạng thái:</strong> {selectedOrder.status}
                      </p>

                      {/* Table for order items */}
                      <h3 className="text-xl font-semibold mb-4">Sản phẩm trong đơn hàng:</h3>
                      <table className="min-w-full bg-gray-100 rounded-md shadow-md">
                        <thead className="bg-blue-200">
                          <tr>
                            <th className="border px-4 py-2 text-left">Mã sản phẩm</th>
                            <th className="border px-4 py-2 text-left">Tên sản phẩm</th>
                            <th className="border px-4 py-2 text-left">Số lượng</th>
                            <th className="border px-4 py-2 text-left">Giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item) => {
                            const product = products.find(prod => prod.id === item.productId); // Get product details using productId
                            return (
                              <tr key={item.productId} className="hover:bg-gray-200 transition-colors duration-200">
                                <td className="border px-4 py-2">{item.productId}</td>
                                <td className="border px-4 py-2">{product ? product.name : 'Unknown Product'}</td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">{product ? product.price : 'N/A'} VND</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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
