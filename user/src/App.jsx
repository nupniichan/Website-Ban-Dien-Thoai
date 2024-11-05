import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CartSidebar from "./components/CartSidebar.jsx";
import Footer from "./Header&Footer/Footer.jsx";
import Header from "./Header&Footer/Header.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import FaQ from "./pages/FAQ.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import PaymentResult from "./pages/PaymentResult.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import SearchResult from "./pages/SearchResults.jsx";
import Shop from "./pages/Shop.jsx";
import Stories from "./pages/Stories.jsx";
import Support from "./pages/Support.jsx";
import Terms from "./pages/Terms.jsx";
import Vacancies from "./pages/Vacancies.jsx";
import PathNames from "./PathNames.js";

function App() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <>
            <Header cartOpen={cartOpen} setCartOpen={setCartOpen} />
            <CartSidebar cartOpen={cartOpen} setCartOpen={setCartOpen} />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path={PathNames.ABOUT} element={<About />} />
                <Route path={PathNames.STORIES} element={<Stories />} />
                <Route path={PathNames.FAQ} element={<FaQ />} />
                <Route path={PathNames.VACANCIES} element={<Vacancies />} />
                <Route path={PathNames.CONTACTUS} element={<ContactUs />} />
                <Route path={PathNames.PRIVACYPOLICY} element={<PrivacyPolicy />} />
                <Route path={PathNames.TERMS} element={<Terms />} />
                <Route path={PathNames.SUPPORT} element={<Support />} />
                <Route path={PathNames.CART} element={<Cart />} />
                <Route path={`${PathNames.CHECKOUT}/:productId`} element={<Checkout />} />
                <Route path={PathNames.PROFILE} element={<Profile />} />
                <Route path={PathNames.MY_ORDERS} element={<MyOrders />} />
                <Route path={PathNames.SEARCH_RESULTS} element={<SearchResult />} />
                <Route path={PathNames.PAYMENT_RESULT} element={<PaymentResult />} />
                <Route path={PathNames.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
                <Route path={PathNames.PAYMENT_FAILED} element={<PaymentFailed />} />
                <Route path={PathNames.SHOP} element={<Shop />} />
                <Route path={`${PathNames.PRODUCT_DETAILS}/:productId`} element={<ProductDetails />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
