import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Providers from './pages/Providers';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import PaymentMethods from './pages/PaymentMethods';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipments from './pages/Shipments';
import SalesReport from './pages/SalesReport';
import ProductSalesReport from './pages/ProductSalesReport';
import Inventory from './pages/Inventory';

const App = () => {
  // Helper to check authentication
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      window.location.href = '/';
      return null;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="categorias" element={<Categories />} />
                  <Route path="productos" element={<Products />} />
                  <Route path="clientes" element={<Customers />} />
                  <Route path="ventas" element={<Sales />} />
                  <Route path="metodos-de-pago" element={<PaymentMethods />} />
                  <Route path="proveedores" element={<Providers />} />
                  <Route path="envios" element={<Shipments />} />
                  <Route path="reporte-ventas" element={<SalesReport />} />
                  <Route path="reporte-ventas-productos" element={<ProductSalesReport />} />
                  <Route path="inventario" element={<Inventory />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;