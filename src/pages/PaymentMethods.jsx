import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/paymentmethods.css';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/payment-methods", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener los métodos de pago");
      const data = await response.json();
      setPaymentMethods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/payment-methods", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al registrar el método de pago");
      setForm({ name: '' });
      fetchPaymentMethods();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este método de pago?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/payment-methods/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al eliminar el método de pago");
      fetchPaymentMethods();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setForm({ name: method.name });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/payment-methods/${editingId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al actualizar el método de pago");
      setEditingId(null);
      setForm({ name: '' });
      fetchPaymentMethods();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando métodos de pago...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="paymentmethods-container">
        <h2>{editingId ? "Editar Método de Pago" : "Registrar Nuevo Método de Pago"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="paymentmethod-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre del método"
            value={form.name}
            onChange={handleChange}
            required
          />
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ name: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id}>
                <td>{method.name}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(method)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(method.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default PaymentMethods;