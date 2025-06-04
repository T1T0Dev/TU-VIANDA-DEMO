import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Pedidos() {
  const [pedidosCompletos, setPedidosCompletos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Pedidos, detalles, clientes y comidas paralelos
      const [resPedidos, resDetalles, resClientes, resComidas] =
        await Promise.all([
          axios.get("/api/pedidos"),
          axios.get("/api/detalle_pedidos"),
          axios.get("/api/clientes"),
          axios.get("/api/comidas"),
        ]);

      setClientes(resClientes.data);
      setComidas(resComidas.data);

      // ...existing code...
      // Map cliente id => nombre para fácil acceso
      const mapaClientes = {};
      resClientes.data.forEach((c) => {
        mapaClientes[c.id] = c.nombre;
      });

      // Map comida id => nombre
      const mapaComidas = {};
      resComidas.data.forEach((c) => {
        mapaComidas[c.id] = c.nombre;
      });

      // Armar pedidos completos con detalles y nombres
      const pedidos = resPedidos.data;
      const detalles = resDetalles.data;

      const pedidosConDetalles = pedidos.map((pedido) => {
        const detallesDelPedido = detalles
          .filter((d) => d.idpedido === pedido.id)
          .map((detalle) => ({
            ...detalle,
            nombreComida: mapaComidas[detalle.idcomida] || "Sin nombre",
          }));

        return {
          ...pedido,
          nombreCliente:
            mapaClientes[pedido.idcliente] || "Cliente no encontrado",
          detalles: detallesDelPedido,
        };
      });

      setPedidosCompletos(pedidosConDetalles);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos. Intenta más tarde.");
      toast.error("Error cargando datos");
    }
  };

  const marcarEntregado = async (idpedido) => {
    try {
      await axios.put(`/api/pedidos/${idpedido}`, {
        estado: "entregado",
      });
      await axios.post("/api/ventas", {
        idpedido,
        fecha_venta: new Date().toISOString(),
      });
      toast.success(`Pedido ${idpedido} marcado como entregado.`);
      cargarDatos();
    } catch (err) {
      console.error("Error marcando entregado:", err);
      toast.error("No se pudo actualizar el pedido.");
    }
  };

  const pedidosFiltrados = pedidosCompletos.filter(
    (pedido) => pedido.estado === filtroEstado
  );

  return (
    <div className="container-crud">
      <h2>PEDIDOS</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={() =>
          setFiltroEstado(
            filtroEstado === "pendiente" ? "entregado" : "pendiente"
          )
        }
      >
        {filtroEstado === "pendiente" ? "VER ENTREGADOS" : "VER PENDIENTES"}
      </button>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Comida</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Envío</th>
            <th>Fecha de Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) =>
            pedido.detalles.map((detalle) => (
              <tr key={`${pedido.id}-${detalle.idcomida}`}>
                <td data-label="Cliente">{pedido.nombreCliente}</td>
                <td data-label="Comida">{detalle.nombreComida}</td>
                <td data-label="Precio Unitario">${detalle.precio_unitario}</td>
                <td data-label="Cantidad">{detalle.cantidad}</td>
                <td data-label="Subtotal">
                  ${detalle.precio_unitario * detalle.cantidad}
                </td>
                <td data-label="Estado">{pedido.estado}</td>
                <td data-label="Envío">
                  {pedido.incluye_envio ? "Con envío" : "Sin envío"}
                </td>
                <td data-label="Fecha de Pedido">
                  {new Date(pedido.fecha).toLocaleString()}
                </td>
                <td data-label="Acciones">
                  {pedido.estado === "pendiente" && (
                    <button onClick={() => marcarEntregado(pedido.id)}>
                      Marcar entregado
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
