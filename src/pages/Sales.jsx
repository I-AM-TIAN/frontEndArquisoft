import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import '../styles/sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario (sin total)
  const [form, setForm] = useState({
    productId: '',
    paymentMethodId: '',
    customerId: '',
    quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar ventas y catálogos
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [salesRes, productsRes, paymentRes, customersRes] = await Promise.all([
          fetch("http://localhost:3000/api/sales", { headers }),
          fetch("http://localhost:3000/api/products", { headers }),
          fetch("http://localhost:3000/api/payment-methods", { headers }),
          fetch("http://localhost:3000/api/customers", { headers })
        ]);
        if (![salesRes, productsRes, paymentRes, customersRes].every(r => r.ok)) {
          throw new Error("Error al obtener los datos");
        }
        setSales(await salesRes.json());
        setProducts(await productsRes.json());
        setPaymentMethods(await paymentRes.json());
        setCustomers(await customersRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getProductName = (id) => {
    const p = products.find(prod => String(prod.id) === String(id));
    return p ? p.name : id;
  };
  const getPaymentMethodName = (id) => {
    const m = paymentMethods.find(pm => String(pm.id) === String(id));
    return m ? m.name : id;
  };
  const getCustomerName = (id) => {
    const c = customers.find(cus => String(cus.id) === String(id));
    return c ? `${c.name} ${c.lastname}` : id;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/sales", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al registrar la venta");
      setForm({ productId: '', paymentMethodId: '', customerId: '', quantity: '' });
      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch("http://localhost:3000/api/sales", { headers });
      if (!response.ok) throw new Error("Error al obtener las ventas");
      setSales(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta venta?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/sales/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al eliminar la venta");
      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (sale) => {
    setEditingId(sale.id);
    setForm({
      productId: sale.productId,
      paymentMethodId: sale.paymentMethodId,
      customerId: sale.customerId,
      quantity: sale.quantity
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/sales/${editingId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Error al actualizar la venta");
      setEditingId(null);
      setForm({ productId: '', paymentMethodId: '', customerId: '', quantity: '' });
      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando ventas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="sales-container">
        <h2>{editingId ? "Editar Venta" : "Registrar Nueva Venta"}</h2>
        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="sale-form">
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona producto</option>
            {products.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
          <select
            name="paymentMethodId"
            value={form.paymentMethodId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona método de pago</option>
            {paymentMethods.map(pm => (
              <option key={pm.id} value={pm.id}>{pm.name}</option>
            ))}
          </select>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona cliente</option>
            {customers.map(cus => (
              <option key={cus.id} value={cus.id}>{cus.name} {cus.lastname}</option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Cantidad"
            value={form.quantity}
            onChange={handleChange}
            required
            min="1"
          />
          <button type="submit">{editingId ? "Actualizar" : "Registrar"}</button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEditingId(null); setForm({ productId: '', paymentMethodId: '', customerId: '', quantity: '' }); }}
            >
              Cancelar
            </button>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>Total</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Método de Pago</th>
              <th>Cliente</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.total}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{getProductName(sale.productId)}</td>
                <td>{getPaymentMethodName(sale.paymentMethodId)}</td>
                <td>{getCustomerName(sale.customerId)}</td>
                <td>{sale.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(sale)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(sale.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Sales;