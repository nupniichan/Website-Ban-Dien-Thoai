import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header&Footer/Header";
import Footer from "./Header&Footer/Footer";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import PathNames from "./PathNames";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path={PathNames.HOMEPAGE} element={<Homepage />} />
                <Route path={PathNames.ABOUT} element={<About />} />
                <Route path={PathNames.CART} element={<Cart />} />
                <Route path={PathNames.CHECKOUT} element={<Checkout />} />
                <Route path={PathNames.PRODUCT_DETAILS} element={<ProductDetails />} />
                <Route path={PathNames.SEARCH_RESULTS} element={<SearchResults />} />
                <Route path={PathNames.PROFILE} element={<Profile />} />
                <Route path={PathNames.MY_ORDERS} element={<MyOrders />} />
                <Route path={PathNames.REGISTER} element={<Register/>} />
                <Route path={PathNames.LOGIN} element={<Login/>} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
