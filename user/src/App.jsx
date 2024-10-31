import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
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
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import SearchResult from "./pages/SearchResults.jsx";
import Stories from "./pages/Stories.jsx";
import Support from "./pages/Support.jsx";
import Vacancies from "./pages/Vacancies.jsx";
import PathNames from "./PathNames.js";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import Shop from "./pages/Shop.jsx";

function App() {
    return (
        <>
        {/* TODO Do notifications for actions */}
            <Header />
            <Routes>
                <Route path={PathNames.REGISTER} element={<Register />} />
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
                <Route path={PathNames.CHECKOUT} element={<Checkout />} />
                <Route path={PathNames.PROFILE} element={<Profile />} />
                <Route path={PathNames.MY_ORDERS} element={<MyOrders />} />
                <Route path={PathNames.LOGIN} element={<Login />} />
                <Route path={PathNames.SEARCH_RESULTS} element={<SearchResult />} />
                <Route path={PathNames.PAYMENTRESULT} element={<PaymentResult />} />
                <Route path={PathNames.PAYMENTSUCCESS} element={<PaymentSuccess />} />
                <Route path={PathNames.PAYMENTFAILED} element={<PaymentFailed />} />
                <Route path={PathNames.PRODUCTS} element={<Shop/>} />

                <Route path={`${PathNames.PRODUCT_DETAILS}/:productId`} element={<ProductDetails />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
