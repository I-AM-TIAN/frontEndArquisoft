import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    proveedorId: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [productsRes, categoriesRes, providersRes] = await Promise.all([
          fetch("http://localhost:3000/api/products", { headers }),
          fetch("http://localhost:3000/api/categories", { headers }),
          fetch("http://localhost:3000/api/proveedores", { headers })
        ]);
        if (!productsRes.ok || !categoriesRes.ok || !providersRes.ok) {
          throw new Error("Error al obtener los datos");
        }
        setProducts(await productsRes.json());
        setCategories(await categoriesRes.json());
        setProviders(await providersRes.json());
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

  const getProviderName = (proveedorId) => {
    const provider = providers.find(prov => prov.id === proveedorId);
    return provider ? provider.razonsocial : proveedorId || "Desconocido";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al registrar el producto");
      setForm({ name: '', price: '', stock: '', categoryId: '', proveedorId: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch("http://localhost:3000/api/products", { headers });
      if (!response.ok) throw new Error("Error al obtener los productos");
      setProducts(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al eliminar el producto");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      proveedorId: product.proveedorId
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/products/${editingId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al actualizar el producto");
      setEditingId(null);
      setForm({ name: '', price: '', stock: '', categoryId: '', proveedorId: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="products-container">
        <h2>{editingId ? "Editar Producto" : "Registrar Nuevo Producto"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="product-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
          />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            name="proveedorId"
            value={form.proveedorId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona proveedor</option>
            {providers.map(prov => (
              <option key={prov.id} value={prov.id}>{prov.razonsocial}</option>
            ))}
          </select>
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ name: '', price: '', stock: '', categoryId: '', proveedorId: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{getProviderName(product.proveedorId)}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Products;