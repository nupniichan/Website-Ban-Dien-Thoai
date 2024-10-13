import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10">
      <div className="container mx-auto flex flex-col justify-between min-h-full">
        <div className="grid grid-cols-10 gap-x-10 items-start mb-10">
          <div className="col-span-2">
            <h2 className="text-4xl font-bold text-gray-800 mt-[90px]">SPhoneC</h2>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Tìm hiểu thêm</h3>
            <ul className="text-gray-600 space-y-2">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Môi trường</a></li>
              <li><a href="#">Công việc</a></li>
              <li><a href="#">Riêng tư</a></li>
              <li><a href="#">Điều khoản</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Tra cứu thông tin</h3>
            <ul className="text-gray-600 space-y-2">
              <li><a href="#">Hóa đơn</a></li>
              <li><a href="#">Ưu đãi</a></li>
              <li><a href="#">Bảo hành</a></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Liên hệ với chúng tôi</h3>
            <p className="text-gray-600">Hotline: 123-456-7</p>
            <p className="text-gray-600">Fax: 123-456-7</p>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Mạng xã hội</h3>
            <div className="flex space-x-4">
              <a href="#"><FaFacebookF className="text-gray-600 hover:text-blue-600" /></a>
              <a href="#"><FaInstagram className="text-gray-600 hover:text-purple-600" /></a>
              <a href="#"><FaTwitter className="text-gray-600 hover:text-blue-400" /></a>
              <a href="#"><FaYoutube className="text-gray-600 hover:text-red-600" /></a>
            </div>
          </div>
        </div>

        {/* Thin Line Divider */}
        <div className="border-t border-gray-300 my-4 w-full" style={{ height: '1px' }} />

        <div className="mt-auto text-center text-gray-500 py-5">
          <p>©2024 - Nhóm G14-18</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
