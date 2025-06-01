// src/pages/Ventas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HistorialVentas() {
  const [ventasDetalles, setVentasDetalles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarVentasDetalles();
  }, []);

  const cargarVentasDetalles = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/ventas/detalles");
      setVentasDetalles(res.data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setError("No se pudieron cargar las ventas. Intenta más tarde.");
      toast.error("Error al cargar ventas. Intenta más tarde.");
    }
  };

  return (
    <div>
      <h1>Ventas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Venta #</th>
            <th>Fecha de Venta</th>
            <th>Pedido #</th>
            <th>Cliente</th>
            <th>Total Venta</th>

          </tr>
        </thead>
        <tbody>
          {ventasDetalles.map((fila) => (
            <tr key={`${fila.id_venta}-${fila.comida}`}>
              <td>{fila.id_venta}</td>
              <td>{new Date(fila.fecha_venta).toLocaleString()}</td>
              <td>{fila.numero_pedido}</td>
              <td>{fila.cliente}</td>
              <td>${fila.total_venta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
