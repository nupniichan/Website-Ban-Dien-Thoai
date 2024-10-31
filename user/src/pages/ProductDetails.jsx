import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const userId = sessionStorage.getItem('userId');

  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the structure of the data
        setProduct(data.product);
        setAvailableColors(data.availableColors);

        const defaultColor = data.availableColors.find(color => color.color === data.product.color);
        if (defaultColor) {
          setSelectedColor(defaultColor.id);
        }
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);



  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > product.quantity) {
      setError('Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này');
    } else {
      setError('');
    }
    setQuantity(value);
  };

  const handleBuyNow = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      window.location.href = '/login';
      return;
    }

    if (!product || !product.id) {
      alert('Không tìm thấy thông tin sản phẩm');
      return;
    }

    if (quantity <= 0 || quantity > product.quantity) {
      alert('Số lượng không hợp lệ!');
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      color: product.color,
      quantity: parseInt(quantity),
      image: product.image
    };

    console.log('Sending cart item:', cartItem);

    try {
      const response = await fetch(`${BASE_URL}/api/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
      }

      alert('Đã thêm sản phẩm vào giỏ hàng thành công');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message);
    }
  };

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen p-5 text-lg">Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md w-full max-w-6xl overflow-hidden">

        {/* Image Section */}
        <div className="w-full md:w-1/3 p-4">
          <img
            src={`${BASE_URL}/${product.image}`}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg border border-gray-300"
          />
        </div>

        {/* Description Section */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">Giá: <span className="font-semibold">{product.price.toLocaleString()} VND</span></p>
          <p className="text-md text-gray-600 mb-4">Mô tả: {product.description}</p>

          {/* Show how many items are left in stock */}
          <p className="text-md text-gray-600 mb-4">
            Trạng thái: <span className={product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.quantity > 0 ? `${product.quantity} sản phẩm còn lại` : 'Hết hàng'}
            </span>
          </p>
          {/* Color Selection */}
          {availableColors.length > 1 && (
            <div className="mt-4">
              <label htmlFor="color" className="text-lg font-semibold mr-2">Màu sắc:</label>
              <select
                id="color"
                value={selectedColor}
                onChange={(e) => {
                  const newColorId = e.target.value;
                  setSelectedColor(newColorId); // Update selected color
                  const newProduct = availableColors.find(color => color.id === newColorId);
                  if (newProduct) {
                    window.location.href = `/product/${newProduct.id}`; // Redirect to the new product
                  }
                }}
                className="w-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableColors.map((colorOption) => (
                  <option key={colorOption.id} value={colorOption.id}>
                    {colorOption.color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selection */}
          {product.quantity > 0 && (
            <div className="mt-4 flex items-center">
              <label htmlFor="quantity" className="text-lg font-semibold mr-2">Số lượng:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className={`ml-4 py-2 px-4 rounded-md transition-colors duration-200 ${
                  userId 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-gray-100 cursor-not-allowed'
                }`}
                onClick={handleBuyNow}
                disabled={!userId}
              >
                {userId ? 'Thêm vào giỏ hàng' : 'Vui lòng đăng nhập'}
              </button>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-6 w-full max-w-6xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Thông số kỹ thuật:</h2>
        <table className="min-w-full border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Thông số</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Màu sắc:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.color || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Hệ điều hành:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.os || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Thương hiệu:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.brand || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>RAM:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.dungLuongRAM || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Bộ nhớ trong:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.boNhoTrong || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Pin:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.pin || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Kích thước màn hình:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.kichThuocManHinh || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Công nghệ màn hình:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.congNgheManHinh || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Camera sau:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.cameraSau || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Camera trước:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.cameraTruoc || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Chipset:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.chipset || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>GPU:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.gpu || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Công nghệ NFC:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.congNgheNFC || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Thẻ SIM:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.theSIM || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Độ phân giải màn hình:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.doPhanGiaiManHinh || 'Không có thông tin'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Cổng sạc:</strong></td>
              <td className="border border-gray-300 px-4 py-2">{product.cauhinh?.congSac || 'Không có thông tin'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
