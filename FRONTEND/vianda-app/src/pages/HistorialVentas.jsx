import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HistorialVentas() {
  const [ventasDetalles, setVentasDetalles] = useState([]);
  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [cantidadVentas, setCantidadVentas] = useState(0);

  useEffect(() => {
    cargarVentasDetalles();
  }, [fechaFiltro]);

  const cargarVentasDetalles = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/ventas/detalles", {
        params: fechaFiltro ? { fecha: fechaFiltro } : {},
      });

      setVentasDetalles(res.data);

      const total = res.data.reduce((acc, venta) => acc + Math.round(venta.total_venta), 0);
      setGananciaTotal(total);
      setCantidadVentas(res.data.length);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setError("No se pudieron cargar las ventas. Intenta más tarde.");
      toast.error("Error al cargar ventas. Intenta más tarde.");
    }
  };

  return (
    <div>
      <h2>📊 HISTORIAL DE VENTAS</h2>

      <label>Filtrar por fecha:</label>{" "}
      <input
        type="date"
        value={fechaFiltro}
        onChange={(e) => setFechaFiltro(e.target.value)}
      />

      {error && <p>{error}</p>}

      <table border="1" cellPadding="5">
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
            <tr key={`${fila.id_venta}-${fila.numero_pedido}`}>
              <td data-label="ID">{fila.id_venta}</td>
              <td data-label="Fecha Venta">{new Date(fila.fecha_venta).toLocaleString()}</td>
              <td data-label="Numero de Pedido">{fila.numero_pedido}</td>
              <td data-label="Cliente">{fila.cliente}</td>
              <td data-label="Total de Venta">${Math.round(fila.total_venta)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <h4>📅 Fecha seleccionada: {fechaFiltro || "Todas"}</h4>
        <p>🧾 Total de ventas: {cantidadVentas}</p>
        <p>💰 Ganancia total: ${gananciaTotal}</p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
