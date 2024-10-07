import { Route, Routes } from "react-router-dom";
import Footer from "./Header&Footer/Footer.jsx";
import Header from "./Header&Footer/Header.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Homepage from "./pages/Homepage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Support from "./pages/Support.jsx";
import PathNames from "./PathNames.js";
import "./App.css";

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path={PathNames.HOMEPAGE} element={<Homepage />} />
                <Route path={PathNames.ABOUT} element={<About />} />
                <Route path={PathNames.SUPPORT} element={<Support />} />
                <Route path={PathNames.CART} element={<Cart />} />
                <Route path={PathNames.CHECKOUT} element={<Checkout />} />
                <Route path={PathNames.PRODUCT_DETAILS} element={<ProductDetails />} />
                <Route path={PathNames.SEARCH_RESULTS} element={<SearchResults />} />
                <Route path={PathNames.PROFILE} element={<Profile />} />
                <Route path={PathNames.MY_ORDERS} element={<MyOrders />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
