import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/productsalesreport.css';

const ProductSalesReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/reporte-ventas-productos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener el reporte");
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <MainLayout>
      <div className="productsalesreport-container">
        <h2>Reporte de Ventas por Producto y Mes</h2>
        {loading && <div>Cargando reporte...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {report.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Producto</th>
                <th>Total Vendido</th>
              </tr>
            </thead>
            <tbody>
              {report.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.month}</td>
                  <td>{row.productName}</td>
                  <td>{row.totalSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {report.length === 0 && !loading && (
          <div>No hay datos para mostrar.</div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductSalesReport;