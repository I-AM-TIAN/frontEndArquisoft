import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/inventory.css';

const Inventory = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/inventory/stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener el inventario");
        const data = await response.json();
        setTotalStock(data.totalStock ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <MainLayout>
      <div className="inventory-container">
        <h2>Inventario</h2>
        {loading && <div>Cargando inventario...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {!loading && !error && (
          <div className="total-stock">
            <span>Total de productos en stock:</span>
            <span className="stock-number">{totalStock}</span>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Inventory;