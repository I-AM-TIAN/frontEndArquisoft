import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/shipments.css';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    Department: '',
    City: '',
    Address: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch("http://localhost:3000/api/envios", { headers });
      if (!response.ok) throw new Error("Error al obtener los envíos");
      setShipments(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/envios", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al registrar el envío");
      setForm({ Department: '', City: '', Address: '' });
      fetchShipments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este envío?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/envios/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al eliminar el envío");
      fetchShipments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (shipment) => {
    setEditingId(shipment.id);
    setForm({
      Department: shipment.Department,
      City: shipment.City,
      Address: shipment.Address
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/envios/${editingId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al actualizar el envío");
      setEditingId(null);
      setForm({ Department: '', City: '', Address: '' });
      fetchShipments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando envíos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="shipments-container">
        <h2>{editingId ? "Editar Envío" : "Registrar Nuevo Envío"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="shipment-form">
          <input
            type="text"
            name="Department"
            placeholder="Departamento"
            value={form.Department}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="City"
            placeholder="Ciudad"
            value={form.City}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Address"
            placeholder="Dirección"
            value={form.Address}
            onChange={handleChange}
            required
          />
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ Department: '', City: '', Address: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>Departamento</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.Department}</td>
                <td>{shipment.City}</td>
                <td>{shipment.Address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(shipment)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(shipment.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Shipments;