import { Route, Routes } from 'react-router-dom'
import './App.css'
import PageNames from './PageNames.js';
import Home from './pages/Home'
import About from './pages/About';
import Cart from './pages/Cart'
import Checkout from './pages/Checkout.jsx'
import SearchResults from './pages/SearchResults.jsx';
import ProductDetails from './pages/ProductDetails.jsx';


function App() {
  return (
    <Routes>
        <Route path={PageNames.HOME} element={<Home/>} />
        <Route path={PageNames.ABOUT} element={<About/>} />
        <Route path={PageNames.CART} element={<Cart/>} />
        <Route path={PageNames.CHECKOUT} element={<Checkout/>} />
        <Route path={`${PageNames.PRODUCT_DETAILS}`} element={<ProductDetails/>} />
        <Route path={`${PageNames.SEARCH_RESULTS}`} element={<SearchResults/>} />
    </Routes>
  );
}

export default App
