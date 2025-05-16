import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]); // Estado para almacenar los métodos de pago
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener los métodos de pago desde la API
    const fetchPaymentMethods = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el JWT del localStorage
        const response = await fetch("http://localhost:3000/api/payment-methods", {
          headers: {
            'Authorization': `Bearer ${token}` // Incluir el JWT en la cabecera
          }
        });
        if (!response.ok) {
          throw new Error("Error al obtener los métodos de pago");
        }
        const data = await response.json();
        setPaymentMethods(data); // Actualiza el estado con los métodos de pago obtenidos
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchPaymentMethods();
  }, []); // El array vacío asegura que la petición se haga solo al montar el componente

  if (loading) {
    return <div>Cargando métodos de pago...</div>; // Muestra un mensaje mientras se cargan los datos
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
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea los métodos de pago obtenidos desde la API */}
            {paymentMethods.map((method, index) => (
              <tr key={index}>
                <td>{method.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default PaymentMethods;