import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Venta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clienteExistente, setClienteExistente] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [incluyeEnvio, setIncluyeEnvio] = useState(false);
  const [comidas, setComidas] = useState([]);
  const [venta, setVenta] = useState(() => {
    const carritoGuardado = localStorage.getItem("carritoVenta");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  const [form, setForm] = useState({ idComida: "", cantidad: 1 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    axios
      .get("/api/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes", err));
  }, []);

  useEffect(() => {
    cargarComidas();
  }, []);

  const cargarComidas = async () => {
    try {
      const res = await axios.get("/api/comidas");
      setComidas(res.data);
    } catch (error) {
      console.error("Error al cargar comidas:", error);
    }
  };

  useEffect(() => {
    const nuevoTotal = venta.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  }, [venta]);

  // ...existing code...
  useEffect(() => {
    localStorage.setItem("carritoVenta", JSON.stringify(venta));
  }, [venta]);
  // ...existing code...

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const createClient = async () => {
    if (!nuevoCliente.nombre.trim()) {
      return toast.error("El nombre del cliente es obligatorio");
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/clientes",
        nuevoCliente
      );
      setClientes((prev) => [...prev, res.data]);
      setClienteSeleccionado(res.data.id);
      setClienteExistente(true);
      setNuevoCliente({ nombre: "", telefono: "", direccion: "" });
      toast.success("Cliente creado exitosamente");
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast.error("Error al crear cliente. Revisá la consola.");
    } finally {
      setLoading(false);
    }
  };

  const agregarItem = () => {
    if (!form.idComida) {
      return toast.error("Seleccioná una comida primero");
    }
    const idBuscado = form.idComida;
    const comidaSeleccionada = comidas.find((c) => c.id == idBuscado);
    if (!comidaSeleccionada) {
      return toast.error("Comida no encontrada");
    }
    const cantidad = parseInt(form.cantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      return toast.error("Cantidad inválida. Debe ser un número positivo.");
    }

    setVenta((prevVenta) => {
      const indexExistente = prevVenta.findIndex(
        (item) => item.id == idBuscado
      );
      if (indexExistente >= 0) {
        const nuevaVenta = [...prevVenta];
        const itemViejo = nuevaVenta[indexExistente];
        const nuevaCantidad = itemViejo.cantidad + cantidad;
        nuevaVenta[indexExistente] = {
          ...itemViejo,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * itemViejo.precio,
        };
        return nuevaVenta;
      } else {
        const nuevoItem = {
          id: comidaSeleccionada.id,
          nombre: comidaSeleccionada.nombre,
          precio: Number(comidaSeleccionada.precio),
          cantidad,
          subtotal: Number(comidaSeleccionada.precio) * cantidad,
        };
        return [...prevVenta, nuevoItem];
      }
    });

    setForm({ idComida: "", cantidad: 1 });
  };

  const eliminarItem = (index) => {
    const nuevaVenta = [...venta];
    nuevaVenta.splice(index, 1);
    setVenta(nuevaVenta);
  };

  // ...existing code...
const enviarPedido = async () => {
  setLoading(true);
  try {
    if (venta.length === 0) {
      toast.error("No hay items en la venta");
      setLoading(false);
      return;
    }

    let idClienteFinal = clienteSeleccionado;

    if (!clienteExistente) {
      if (!nuevoCliente.nombre.trim()) {
        toast.error("El nombre del cliente es obligatorio");
        setLoading(false);
        return;
      }
      const resCliente = await axios.post(
        "/api/clientes",
        nuevoCliente
      );
      idClienteFinal = resCliente.data.id;
      setClientes((prev) => [...prev, resCliente.data]);
      setClienteSeleccionado(idClienteFinal);
      setClienteExistente(true);
    }

    if (!idClienteFinal) {
      toast.error("No se pudo determinar el cliente para el pedido");
      setLoading(false);
      return;
    }

    // Asegúrate de enviar idcliente como string
    const resPedido = await axios.post("/api/pedidos", {
      idcliente: String(idClienteFinal),
      incluye_envio: incluyeEnvio,
      estado: "pendiente",
      fecha: new Date().toISOString(),
    });

    const idpedido = resPedido.data.id;

    await Promise.all(
      venta.map((item) =>
        axios.post("/api/detalle_pedidos", {
          idpedido: String(idpedido),
          idcomida: String(item.id),
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })
      )
    );

    toast.success("Pedido enviado con éxito");

    setVenta([]);
    localStorage.removeItem("carritoVenta");
    setForm({ idComida: "", cantidad: 1 });
    setMostrarModal(false);
    setNuevoCliente({ nombre: "", telefono: "", direccion: "" });
    setIncluyeEnvio(false);
    setClienteSeleccionado(null);
  } catch (error) {
    console.error("Error al enviar pedido:", error);
    toast.error("Error al enviar el pedido. Revisá la consola.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container-crud">
      <h1>VENTAS</h1>

      <div>
        <select name="idComida" value={form.idComida} onChange={handleChange}>
          <option value="" disabled>
            Seleccioná una comida
          </option>
          {comidas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} (${c.precio})
            </option>
          ))}
        </select>

        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          min={1}
        />

        <button onClick={agregarItem}>Agregar</button>
        <button
          onClick={() => {
            setVenta([]);
            localStorage.removeItem("carritoVenta");
          }}
        >
          Vaciar Carrito
        </button>
        <button onClick={() => setMostrarModal(true)}>Enviar Pedido</button>
        <h2 className="total-venta">Total: ${total}</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {venta.map((item, index) => (
            <tr key={index}>
              <td data-label="Comida">{item.nombre}</td>
              <td data-label="Precio">{"$" + item.precio}</td>
              <td data-label="Cantidad">{item.cantidad}</td>
              <td data-label="Subtotal">{item.subtotal}</td>
              <td>
                <button onClick={() => eliminarItem(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enviar Pedido</h2>
            <label className="label-switch">
              Cliente existente:
              <input
                type="checkbox"
                checked={clienteExistente}
                onChange={(e) => setClienteExistente(e.target.checked)}
                className="input-switch"
              />
              <span className="custom-switch"></span>
            </label>
            {clienteExistente ? (
              <div>
                <select
                  value={clienteSeleccionado || ""}
                  onChange={(e) => setClienteSeleccionado(e.target.value)}
                  disabled={loading}
                >
                  <option value="" disabled>
                    Selecciona un cliente
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <button onClick={enviarPedido} disabled={loading}>
                  {loading ? "Enviando..." : "Confirmar Pedido"}
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <label className="label-switch">
                  Incluye envío:
                  <input
                    type="checkbox"
                    checked={incluyeEnvio}
                    onChange={(e) => setIncluyeEnvio(e.target.checked)}
                    disabled={loading}
                    className="input-switch"
                  />
                  <span className="custom-switch"></span>
                </label>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Nombre del Cliente"
                  value={nuevoCliente.nombre}
                  onChange={(e) =>
                    setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                  }
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={nuevoCliente.telefono}
                  onChange={(e) =>
                    setNuevoCliente({
                      ...nuevoCliente,
                      telefono: e.target.value,
                    })
                  }
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={nuevoCliente.direccion}
                  onChange={(e) =>
                    setNuevoCliente({
                      ...nuevoCliente,
                      direccion: e.target.value,
                    })
                  }
                  disabled={loading}
                />
                <button onClick={createClient} disabled={loading}>
                  {loading ? "Creando..." : "Crear cliente"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
