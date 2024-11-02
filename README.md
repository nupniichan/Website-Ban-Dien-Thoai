<div align="center">

# Phone E-commerce Website

[![ReactJS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern e-commerce platform for mobile phones with comprehensive admin and user functionalities.

[Features](#features) •
[Getting Started](#getting-started) •
[Installation](#installation) •
[Configuration](#configuration) •
[Contributing](#contributing)

</div>

## Features

### 🚀 Highlights
- Excel export functionality for inventory management
- MoMo payment integration
- CI/CD pipeline implementation
- Responsive user interface
- Comprehensive admin dashboard
- And more...

### 💡 Core Features
- **Admin Panel**: Complete control over products, orders, vouchers, customers,...
- **User Interface**: Intuitive shopping experience
- **Server**: Backend architecture

## Getting Started

### Prerequisites

**Required:**
- Bun Runtime
- Node.js >= 20.00
- IDE (Visual Studio Code, JetBrains, etc.)
- MongoDB

**Optional:**
- Deployment server ( it quite hard so you can DM me if you want to do this )

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nupniichan/Website-Ban-Dien-Thoai.git
cd Website-Ban-Dien-Thoai
```

### 2. Admin Panel Setup

```bash
cd admin
bun install
bun run dev
```

### 3. User Interface Setup

```bash
cd user
bun install
bun run dev
```

### 4. Server Setup

```bash
cd server
bun install
bun server.js
```

## Configuration

### MongoDB Setup

1. Create a MongoDB database
2. Configure the connection string:
   ```javascript
   // /server/module/db.js
   // Replace YOUR_CONNECTION_STRING with your MongoDB connection URL
   ```

### Server Configuration (Optional)

For deployment, modify CORS settings in `server.js`:
```javascript
app.use(cors({ 
  origin: ['YOUR_SERVER_IP'] 
}));
```

## Project Structure

```
├── admin/              # Admin panel (React + Vite)
├── user/               # User interface (React + Vite)
├── server/             # Backend server (Node.js)
│   ├── module/        # Server modules
│   └── server.js      # Main server file
└── README.md
```

## Branch Management

- `develop` - Main development branch
- `main` - Production/deployment branch

## Tech Stack

### Frontend
- ⚛️ React.js
- 🛠️ Vite
- 🎨 Tailwind CSS
- 🚀 Bun Runtime

### Backend
- 📡 Node.js
- 🗄️ MongoDB
- 🚀 Bun Runtime

## Development

- 🚀 Your server ( hosted on any services like Azure, AWS, Google Cloud ,... )

## Contributing

1. This project is no longer update :( but if you want become one of my contributor look for my ChinoKafuu project

## Contributors

Thanks to these wonderful people:

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

## License

This project is licensed under the MIT License - see the [LICENSE](https://vi.wikipedia.org/wiki/Gi%E1%BA%A5y_ph%C3%A9p_MIT) file for details.

---

<div align="center">

Made with ❤️ by [nupniichan](https://github.com/nupniichan)

[![GitHub followers](https://img.shields.io/github/followers/nupniichan?style=social)](https://github.com/nupniichan)

</div>
