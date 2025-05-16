import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/salesreport.css";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ startDate, endDate }).toString();
      const response = await fetch(
        `http://localhost:3000/api/sales-reports?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al obtener el reporte");
      const data = await response.json();
      setReport(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalGeneral = report.reduce(
    (acc, sale) => acc + Number(sale.totalPrice || 0),
    0
  );

  return (
    <MainLayout>
      <div className="salesreport-container">
        <h2>Reporte de Ventas</h2>
        <form className="report-form" onSubmit={fetchReport}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <button type="submit">Consultar</button>
        </form>
        {loading && <div>Cargando reporte...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {report.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cliente</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {report.map((sale) => (
                console.log(sale),
                <tr key={sale.id}>
                  <td>
                    {sale.date ? new Date(sale.date).toLocaleDateString() : ""}
                  </td>
                  <td>{sale.productName}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.totalPrice}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td
                  colSpan={4}
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total general:
                </td>
                <td style={{ fontWeight: "bold" }}>{totalGeneral}</td>
              </tr>
            </tbody>
          </table>
        )}
        {report.length === 0 && !loading && (
          <div>No hay datos para el rango seleccionado.</div>
        )}
      </div>
    </MainLayout>
  );
};

export default SalesReport;
