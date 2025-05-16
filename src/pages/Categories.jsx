import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el JWT del localStorage
        const response = await fetch("http://localhost:3000/api/categories", {
          headers: {
            'Authorization': `Bearer ${token}` // Incluir el JWT en la cabecera
          }
        });
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainLayout>
      <div className="categories-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
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
