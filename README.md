## Website Bán Điện Thoại

<div align="center">

[![ReactJS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Một nền tảng thương mại điện tử hiện đại dành cho cửa hàng điện thoại di động với đầy đủ chức năng quản trị và người dùng.

[Tính năng](#tính-năng) •
[Bắt đầu](#bắt-đầu) •
[Cài đặt](#cài-đặt) •
[Cấu hình](#cấu-hình) •

</div>

## Tính năng

### 🚀 Điểm nổi bật

- Chức năng xuất dữ liệu sang Excel để quản lý kho hàng
- Tích hợp thanh toán Momo
- Triển khai pipeline CI/CD
- Giao diện người dùng bắt mắt
- Bảng điều khiển quản trị toàn diện
- Và nhiều hơn nữa...

### 💡 Tính năng cốt lõi

- **Admin dashboard**: Kiểm soát hoàn toàn sản phẩm, đơn hàng, phiếu giảm giá, khách hàng,...
- **Giao diện người dùng**: Trải nghiệm mua sắm trực quan nhất dành cho người dùng

## Bắt đầu

### Điều kiện tiên quyết

**Bắt buộc:**

- Bun Runtime
- Node.js >= 20.00
- Môi trường phát triển tích hợp (IDE) (Visual Studio Code, JetBrains, v.v.)
- MongoDB

**Tùy chọn:**

- Triển khai tự động (khá khó vì nó cần kĩ năng devops, nếu bạn muốn bạn có thể nhắn tin riêng cho mình nếu muốn thực hiện việc này)

## Cài đặt

### 1. Clone dự án về

```bash
git clone https://github.com/nupniichan/Website-Ban-Dien-Thoai.git
cd Website-Ban-Dien-Thoai
```

### 2. Cài đặt và khởi chạy admin

```bash
cd admin
bun install
bun run dev
```

### 3. Cài đặt và khởi chạy giao diện người dùng

```bash
cd user
bun install
bun run dev
```

### 4. Cài đặt máy chủ

```bash
cd server
bun install
bun server.js
```

## Cấu hình

### Cấu hình MongoDB

1. Tạo cơ sở dữ liệu MongoDB
2. Cấu hình url đến MongoDB:

   ```js
   // /server/module/db.js
   // Thay thế YOUR_CONNECTION_STRING bằng URL kết nối MongoDB của bạn
   ```

### Cấu hình triển khai tự động (Tùy chọn)

Đối với việc triển khai, Bạn cần sửa đổi cài đặt CORS trong `server.js`:

```javascript
app.use(cors({
  origin: ['YOUR_SERVER_IP'] // [YOUR_SERVER_IP] ở đây sẽ là ip public của server bạn. Còn nếu chạy localhost thì cứ để là localhost:5173 và localhost:5174 là được
}));
```

## Cấu trúc dự án

```
├── admin/              # Admin (React + Vite)
├── user/               # User (React + Vite)
├── server/             # Backend (Node.js)
│   ├── module/        # Mô-đun máy chủ
│   └── server.js      # Thư mục làm việc chính của server
└── README.md
```

## Quản lý nhánh

- `develop` - Nhánh phát triển chính
- `main` - Nhánh production

## Công nghệ sử dụng

### Frontend

- ⚛️ React.js
- 🛠️ Vite
- 🎨 Tailwind CSS

### Backend

- 📡 Node.js
- 🗄️ MongoDB
- 🚀 Bun Runtime

### Tools
- Docker
- Github action

## CI/CD

- 🚀 Azure (Ubuntu server 24.04)


## Người đóng góp

Cảm ơn những người bạn tuyệt vời này đã góp phần xây dựng dự án này:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ThePinkKitten">
        <img src="https://avatars.githubusercontent.com/u/61980152?v=4" width="100px;" alt="ThePinkKitten"/><br />
        <sub><b>ThePinkKitten</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Tequinzyy">
        <img src="https://avatars.githubusercontent.com/u/116754124?v=4" width="100px;" alt="Tequinzyy"/><br />
        <sub><b>Tequinzyy</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/KevzCz">
        <img src="https://avatars.githubusercontent.com/u/130611225?v=4" width="100px;" alt="KevzCz"/><br />
        <sub><b>KevzCz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Phatds357">
        <img src="https://avatars.githubusercontent.com/u/161195912?v=4" width="100px;" alt="Phatds357"/><br />
        <sub><b>Phatds357</b></sub>
      </a>
    </td>
  </tr>
</table>


<div align="center">

Cảm ơn bạn đã ghé thăm responsitory này ❤️

</div>
