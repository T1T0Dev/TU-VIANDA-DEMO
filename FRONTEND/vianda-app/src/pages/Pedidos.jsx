// src/pages/Pedidos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Pedidos() {
  const [pedidoDetalles, setPedidoDetalles] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPedidoDetalles();
  }, []);

  const cargarPedidoDetalles = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/pedidos/detalles");
      setPedidoDetalles(res.data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("No se pudieron cargar los pedidos. Intenta más tarde.");
      toast.error("Error al cargar pedidos. Intenta más tarde.");
    }
  };

  const marcarEntregado = async (idpedido) => {
    try {
      // 1) Cambiar estado a "entregado" en pedidos
      await axios.put(`http://localhost:3001/api/pedidos/${idpedido}`);

      // 2) Insertar en tabla ventas automáticamente (suponiendo que tu backend hace esto)
      await axios.post("http://localhost:3001/api/ventas", { idpedido });

      toast.success(`Pedido ${idpedido} marcado como entregado.`);

      // 3) Refrescar la grilla
      cargarPedidoDetalles();
    } catch (err) {
      console.error("Error al marcar entregado:", err);
      toast.error("No se pudo actualizar el pedido. Revisá la consola.");
    }
  };

  const pedidosFiltrados = pedidoDetalles.filter(
  (pedido) => pedido.estado === filtroEstado
  );


  return (
    <div className="container-crud">
      <h2>PEDIDOS</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={() =>
          setFiltroEstado(filtroEstado === "pendiente" ? "entregado" : "pendiente")
        }
      >
        {filtroEstado === "pendiente" ? "VER ENTREGADOS" : "VER PENDIENTES"}
      </button>

      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Comida</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Envio</th>
            <th>Fecha de Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((fila) => (
            <tr key={`${fila.numero_pedido}-${fila.comida}`}>
              <td data-label="Pedido #">{fila.numero_pedido}</td>
              <td data-label="Cliente">{fila.cliente}</td>
              <td data-label="Comida">{fila.comida}</td>
              <td data-label="Precio Unitario">{"$"+fila.preciounitario}</td>
              <td data-label="Cantidad">{fila.cantidad}</td>
              <td data-label="Subtotal">${fila.subtotal}</td>
              <td data-label="Estado">{fila.estado}</td>
              <td data-label="Envio">{fila.envio === 1 ? "Con envio" : "Sin envio"}</td>
              <td data-label="Fecha de Pedido">{new Date(fila.fecha_pedido).toLocaleString()}</td>
              <td data-label="Acciones">
                {fila.estado === "pendiente" && (
                  <button
                    onClick={() => marcarEntregado(fila.numero_pedido)}
                  >
                    Marcar entregado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
