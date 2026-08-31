import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Services from './pages/Services.jsx';
import Wholesale from './pages/Wholesale.jsx';
import Gallery from './pages/Gallery.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles.css';

const Protected = ({ children }) => localStorage.getItem('sb_admin_token') ? children : <Navigate to="/admin/login" replace />;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
          <Route path="/admin/products" element={<Protected><AdminProducts /></Protected>} />
          <Route path="/admin/orders" element={<Protected><AdminOrders /></Protected>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
