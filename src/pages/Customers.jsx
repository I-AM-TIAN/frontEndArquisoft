import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const Customers = () => {
  const [customers, setCustomers] = useState([]); // Estado para almacenar los clientes
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener los clientes desde la API
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/customers");
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        setCustomers(data); // Actualiza el estado con los clientes obtenidos
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchCustomers();
  }, []); // El array vacío asegura que la petición se haga solo al montar el componente

  if (loading) {
    return <div>Cargando clientes...</div>; // Muestra un mensaje mientras se cargan los datos
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
              <th>Apellido</th>
              <th>Identificación</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea los clientes obtenidos desde la API */}
            {customers.map((customer) => (
              <tr key={customer.identification}>
                <td>{customer.name}</td>
                <td>{customer.lastname}</td>
                <td>{customer.identification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Customers;