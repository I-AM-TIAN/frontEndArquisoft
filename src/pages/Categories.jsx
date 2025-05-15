import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener las categorías desde la API
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategories(data); // Actualiza el estado con las categorías obtenidas
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchCategories();
  }, []); // El array vacío asegura que la petición se haga solo al montar el componente

  if (loading) {
    return <div>Cargando categorías...</div>; // Muestra un mensaje mientras se cargan los datos
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea las categorías obtenidas desde la API */}
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Categories;