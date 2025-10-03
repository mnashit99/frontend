import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AllProductsPage from './pages/AllProductsPage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import AuthInitializer from '../src/components/common/AuthInitializer/AuthInitializer'; // ✅ ADD THIS
import './App.css';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchPage from './pages/SearchPage';

function App() {
  useAuth(); // Keep this if you need it for other auth logic

  return (
    
    <BrowserRouter>
      <div className="App">
       
        <AuthInitializer />
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/addresses" element={<ProtectedRoute element={<AddressesPage />} />} />
            {/* Add other routes here as we create the pages */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;