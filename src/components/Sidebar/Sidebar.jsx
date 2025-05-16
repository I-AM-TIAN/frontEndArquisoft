import React from 'react';
import './Sidebar.css';  // Estilos de la sidebar
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <ul>
        <li><a href="/dashboard">Inicio</a></li>
        <li><a href="/categorias">Categorias</a></li>
        <li><a href="/productos">Productos</a></li>
        <li><a href="/proveedores">Proveedores</a></li>
        <li><a href="/clientes">Clientes</a></li>
        {/*
        <li><a href="/ventas">Ventas</a></li>
        <li><a href="">Reporte de ventas</a></li>
        <li><a href="">Reporte de productos</a></li>*/}
        <li><a href="">Dirección de envío</a></li>
        <li><a href="/metodos-de-pago">Métodos de pago</a></li>
        <li>
          <a href="" onClick={handleLogout}>Cerrar sesion</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;