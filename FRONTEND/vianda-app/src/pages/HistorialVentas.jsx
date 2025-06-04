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
      // Traer todas las colecciones necesarias
      const [resVentas, resPedidos, resClientes, resDetalles] = await Promise.all([
        axios.get("/api/ventas"),
        axios.get("/api/pedidos"),
        axios.get("/api/clientes"),
        axios.get("/api/detalle_pedidos"),
      ]);

      // Mapear clientes por id
      const mapaClientes = {};
      resClientes.data.forEach(c => {
        mapaClientes[c.id] = c.nombre;
      });

      // Mapear pedidos por id
      const mapaPedidos = {};
      resPedidos.data.forEach(p => {
        mapaPedidos[p.id] = p;
      });

      // Agrupar detalles por idpedido
      const detallesPorPedido = {};
      resDetalles.data.forEach(d => {
        if (!detallesPorPedido[d.idpedido]) detallesPorPedido[d.idpedido] = [];
        detallesPorPedido[d.idpedido].push(d);
      });

      // Armar el array de ventas con detalles
      let ventas = resVentas.data.map(v => {
        const pedido = mapaPedidos[v.idpedido] || {};
        const cliente = mapaClientes[pedido.idcliente] || "Desconocido";
        const detalles = detallesPorPedido[v.idpedido] || [];

        // Calcular el total de la venta sumando los subtotales de los detalles
        const total_venta = detalles.reduce(
          (acc, det) => acc + (Number(det.precio_unitario) * Number(det.cantidad)),
          0
        );

        return {
          id_venta: v.id,
          fecha_venta: v.fecha_venta,
          numero_pedido: v.idpedido,
          cliente,
          total_venta,
        };
      });

      // Filtrar por fecha si corresponde
      if (fechaFiltro) {
        ventas = ventas.filter((venta) => {
          const fechaVenta = new Date(venta.fecha_venta).toISOString().split("T")[0];
          return fechaVenta === fechaFiltro;
        });
      }

      setVentasDetalles(ventas);
      setGananciaTotal(ventas.reduce((acc, venta) => acc + Math.round(venta.total_venta), 0));
      setCantidadVentas(ventas.length);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setError("No se pudieron cargar las ventas. Intenta más tarde.");
      toast.error("Error al cargar ventas. Intenta más tarde.");
    }
  };

  return (
    <div className="container-crud">
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
            <th>Total Venta</th>
          </tr>
        </thead>
        <tbody>
          {ventasDetalles.map((fila) => (
            <tr key={`${fila.id_venta}-${fila.numero_pedido}`}>
              <td data-label="ID">{fila.id_venta}</td>
              <td data-label="Fecha Venta">{new Date(fila.fecha_venta).toLocaleString()}</td>
              <td data-label="Numero de Pedido">{fila.numero_pedido}</td>
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