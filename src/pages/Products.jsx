import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]); // Estado para productos
  const [categories, setCategories] = useState([]); // Estado para categorías
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener JWT
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/api/products", { headers }),
          fetch("http://localhost:3000/api/categories", { headers })
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Desconocido";
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainLayout>
      <div className="products-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{product.proveedorId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Products;
