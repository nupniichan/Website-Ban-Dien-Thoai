import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./Header&Footer/Footer.jsx";
import Header from "./Header&Footer/Header.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import Support from "./pages/Support.jsx";
import PathNames from "./PathNames.js";
import PaymentResult from './pages/PaymentResult.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentFailed from './pages/PaymentFailed.jsx'
import "./App.css";
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import SearchResult from './pages/SearchResults.jsx'
/* ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⠴⠶⠶⡦⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⡾⠋⠁⠀⠀⠀⠀⠀⠀⠈⠙⠳⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⠁⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⣠⢾⡟⠛⢻⣿⣶⣄⠀⠀⣠⣴⣶⣿⣶⣶⣦⡀⠀⢻⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⡇⢿⣇⣀⣼⣿⣿⣿⡆⣼⡏⠀⢹⣿⣿⣿⣿⣿⡀⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢘⣷⡸⣿⣿⣿⣿⢿⣿⣿⣿⣿⣾⣿⣿⡟⣹⣿⢻⣷⠟⠀⠀⠀⠀⠀⠀
⢠⡤⠤⢿⠙⢷⣬⣙⣿⣿⣶⣿⠟⠙⢿⣿⣿⡿⢿⣟⣵⣿⣯⣄⣀⣤⣤⡄⠀⠀
⠘⢧⣄⡀⠀⠀⠈⠻⣭⣍⠉⠁⠀⠀⢀⣉⣉⣻⣿⠿⠛⠁⠀⠈⠉⠁⠀⡇⠀⠀
⠀⢰⠟⠁⠀⠀⠀⢀⣤⠈⠓⠤⠴⠞⠛⠛⠋⠉⠐⣶⢦⡄⠀⠀⠀⠀⠀⠉⢳⡄
⠀⠻⣤⣤⠖⣆⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡆⣹⠂⠀⠀⠀⢠⡶⠾⠃
⠀⠀⠀⠀⠀⠉⠛⢡⡿⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠈⢧⢿⣤⠴⠷⣤⣸⠇⠀⠀
⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⢉⡿⠉⠉⠋⠛⠛⢻⡗⠀⠈⢷⡀⠀⠀⠀⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠳⠤⠶⠟⠁⠀⠀⠀⠀⠀⠀⠻⢶⣤⡼⠃⠀⠀⠀⠀⠀⠀⠀ */

function App() {
    return (
        <>
            <Header />  {/* Phần Header hiển thị cố định trên tất cả các trang */}
            <Routes>
                <Route path={PathNames.REGISTER} element={<Register />} /> 
                <Route path="/" element={<Homepage />} />
                <Route path={PathNames.ABOUT} element={<About />} />
                <Route path={PathNames.SUPPORT} element={<Support />} />
                <Route path={PathNames.CART} element={<Cart />} />
                <Route path={PathNames.CHECKOUT} element={<Checkout />} />
                <Route path={PathNames.PROFILE} element={<Profile />} />
                <Route path={PathNames.MY_ORDERS} element={<MyOrders />} />
                <Route path={PathNames.REGISTER} element={<Register/>} />
                <Route path={PathNames.LOGIN} element={<Login/>} />
                <Route path={PathNames.SEARCH_RESULTS} element={<SearchResult />} />
                <Route path={PathNames.REGISTER} element={<Register />} />
                <Route path={PathNames.LOGIN} element={<Login />} />
                <Route path={PathNames.PAYMENTRESULT} element={<PaymentResult />} />
                <Route path={PathNames.PAYMENTSUCCESS} element={<PaymentSuccess />} />
                <Route path={PathNames.PAYMENTFAILED} element={<PaymentFailed />} />
                {/* Route chi tiết sản phẩm với tham số productId */}
                <Route path={`${PathNames.PRODUCT_DETAILS}/:productId`} element={<ProductDetails />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
