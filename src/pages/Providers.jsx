import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import '../styles/providers.css';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [form, setForm] = useState({ nit: '', razonsocial: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/proveedores', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener los proveedores');
      const data = await response.json();
      setProviders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/proveedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Error al registrar el proveedor');
      setForm({ nit: '', razonsocial: '' });
      fetchProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/proveedores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar el proveedor');
      fetchProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (provider) => {
    setEditingId(provider.id || provider.nit);
    setForm({ nit: provider.nit, razonsocial: provider.razonsocial });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/proveedores/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Error al actualizar el proveedor');
      setEditingId(null);
      setForm({ nit: '', razonsocial: '' });
      fetchProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando proveedores...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="providers-container">
        <h2>{editingId ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="provider-form">
          <input
            type="text"
            name="nit"
            placeholder="NIT"
            value={form.nit}
            onChange={handleChange}
            required
            disabled={!!editingId}
          />
          <input
            type="text"
            name="razonsocial"
            placeholder="Razón Social"
            value={form.razonsocial}
            onChange={handleChange}
            required
          />
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ nit: '', razonsocial: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>NIT</th>
              <th>Razón Social</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id || provider.nit}>
                <td>{provider.nit}</td>
                <td>{provider.razonsocial}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(provider)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(provider.id || provider.nit)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Providers;