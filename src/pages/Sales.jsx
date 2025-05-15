import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const Sales = () => {
  const [sales, setSales] = useState([]); // Estado para almacenar las ventas
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener las ventas desde la API
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sales");
        if (!response.ok) {
          throw new Error("Error al obtener las ventas");
        }
        const data = await response.json();
        setSales(data); // Actualiza el estado con las ventas obtenidas
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchSales();
  }, []); // El array vacío asegura que la petición se haga solo al montar el componente

  if (loading) {
    return <div>Cargando ventas...</div>; // Muestra un mensaje mientras se cargan los datos
  }

  if (error) {
    return <div>Error: {error}</div>; // Muestra un mensaje de error si ocurre un problema
  }

  return (
    <MainLayout>
      <div>
        <table>
          <thead>
            <tr>
              <th>Total</th>
              <th>Fecha</th>
              <th>Producto ID</th>
              <th>Método de Pago ID</th>
              <th>Cliente ID</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea las ventas obtenidas desde la API */}
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.total}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{sale.productId}</td>
                <td>{sale.paymentMethodId}</td>
                <td>{sale.customerId}</td>
                <td>{sale.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Sales;