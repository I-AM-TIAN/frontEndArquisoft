import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';  // Estilos del layout

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <main>{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
