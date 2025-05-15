import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const Products = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener los productos y categorías desde la API
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/api/products"),
          fetch("http://localhost:3000/api/categories"),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData); // Actualiza el estado con los productos obtenidos
        setCategories(categoriesData); // Actualiza el estado con las categorías obtenidas
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchData();
  }, []); // El array vacío asegura que la petición se haga solo al montar el componente

  // Función para obtener el nombre de la categoría por su ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Desconocido";
  };

  if (loading) {
    return <div>Cargando productos...</div>; // Muestra un mensaje mientras se cargan los datos
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
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea los productos obtenidos desde la API */}
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{getCategoryName(product.categoryId)}</td> {/* Mostrar el nombre de la categoría */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Products;