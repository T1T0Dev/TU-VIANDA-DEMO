// src/pages/Pedidos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Pedidos() {
  const [pedidoDetalles, setPedidoDetalles] = useState([]);
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

  return (
    <div>
      <h1>Pedidos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Pedido #</th>
            <th>Cliente</th>
            <th>Comida</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Fecha de Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidoDetalles.map((fila) => (
            <tr key={`${fila.numero_pedido}-${fila.comida}`}>
              <td>{fila.numero_pedido}</td>
              <td>{fila.cliente}</td>
              <td>{fila.comida}</td>
              <td>{"$"+fila.preciounitario}</td>
              <td>{fila.cantidad}</td>
              <td>${fila.subtotal}</td>
              <td>{fila.estado}</td>
              <td>{new Date(fila.fecha_pedido).toLocaleString()}</td>
              <td>
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
