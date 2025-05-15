import React from 'react';
import './Sidebar.css';  // Estilos de la sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><a href="/dashboard">Inicio</a></li>
        <li><a href="/categorias">Categorias</a></li>
        <li><a href="/productos">Productos</a></li>
        <li><a href="/proveedores">Proveedores</a></li>
        <li><a href="/clientes">Clientes</a></li>
        <li><a href="/ventas">Ventas</a></li>
        <li><a href="">Reporte de ventas</a></li>
        <li><a href="">Reporte de productos</a></li>
        <li><a href="">Dirección de envío</a></li>
        <li><a href="/metodos-de-pago">Métodos de pago</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
