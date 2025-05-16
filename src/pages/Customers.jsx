import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [form, setForm] = useState({ name: '', lastname: '', identification: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener los clientes");
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al registrar el cliente");
      setForm({ name: '', lastname: '', identification: '' });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al eliminar el cliente");
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id || customer.identification);
    setForm({
      name: customer.name,
      lastname: customer.lastname,
      identification: customer.identification
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${editingId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al actualizar el cliente");
      setEditingId(null);
      setForm({ name: '', lastname: '', identification: '' });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="customers-container">
        <h2>{editingId ? "Editar Cliente" : "Registrar Nuevo Cliente"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="customer-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Apellido"
            value={form.lastname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="identification"
            placeholder="Identificación"
            value={form.identification}
            onChange={handleChange}
            required
            disabled={!!editingId}
          />
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ name: '', lastname: '', identification: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Identificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id || customer.identification}>
                <td>{customer.name}</td>
                <td>{customer.lastname}</td>
                <td>{customer.identification}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(customer)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(customer.id || customer.identification)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Customers;