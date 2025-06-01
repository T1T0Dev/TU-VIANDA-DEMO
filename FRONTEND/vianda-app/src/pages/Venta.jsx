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
  const [venta, setVenta] = useState([]);
  const [form, setForm] = useState({ idComida: "", cantidad: 1 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // <-- nuevo estado

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes", err));
  }, []);

  useEffect(() => {
    cargarComidas();
  }, []);

  const cargarComidas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/comidas");
      setComidas(res.data);
    } catch (error) {
      console.error("Error al cargar comidas:", error);
    }
  };

  useEffect(() => {
    const nuevoTotal = venta.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(nuevoTotal);
  }, [venta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const createClient = async () => {
    if (!nuevoCliente.nombre.trim()) {
      return toast.error("El nombre del cliente es obligatorio");
    }
    try {
      const res = await axios.post(
        "http://localhost:3001/api/clientes",
        nuevoCliente
      );
      setClientes((prev) => [...prev, res.data]);
      setClienteSeleccionado(res.data.idcliente);
      setClienteExistente(true); // Ahora es cliente existente
      setNuevoCliente({ nombre: "", telefono: "", direccion: "" }); // Limpiar formulario

      toast.success("Cliente creado exitosamente");
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast.error("Error al crear cliente. Revisá la consola.");
    }
  };

  const agregarItem = () => {
    if (!form.idComida) {
      return toast.error("Seleccioná una comida primero");
    }
    const idBuscado = Number(form.idComida);
    const comidaSeleccionada = comidas.find(
      (c) => Number(c.idComida) === idBuscado
    );
    if (!comidaSeleccionada) {
      return toast.error("Comida no encontrada");
    }
    const cantidad = parseInt(form.cantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      return toast.error("Cantidad inválida. Debe ser un número positivo.");
    }

    setVenta((prevVenta) => {
      const indexExistente = prevVenta.findIndex(
        (item) => Number(item.idComida) === idBuscado
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
          idComida: comidaSeleccionada.idComida,
          nombre: comidaSeleccionada.nombre,
          precio: comidaSeleccionada.precio,
          cantidad,
          subtotal: comidaSeleccionada.precio * cantidad,
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

  // La magia está acá
  // Dentro de tu componente Venta.jsx...

const enviarPedido = async () => {
  setLoading(true);

  try {
    let idClienteFinal = clienteSeleccionado;

    // 1) Si no es cliente existente, lo creo primero y obtengo su id.
    if (!clienteExistente) {
      if (!nuevoCliente.nombre.trim()) {
        toast.error("El nombre del cliente es obligatorio");
        setLoading(false);
        return;
      }

      const resCliente = await axios.post(
        "http://localhost:3001/api/clientes",
        nuevoCliente
      );
      idClienteFinal = resCliente.data.idcliente;
      setClientes((prev) => [...prev, resCliente.data]);
      setClienteSeleccionado(idClienteFinal);
      setClienteExistente(true);
    }

    // 2) Verifico que ya tenga un idCliente antes de continuar.
    if (!idClienteFinal) {
      toast.error("No se pudo determinar el cliente para el pedido");
      setLoading(false);
      return;
    }

    // 3) Creo el pedido y guardo el idpedido que devuelve el backend.
    const resPedido = await axios.post("http://localhost:3001/api/pedidos", {
      idcliente: idClienteFinal,
      incluye_envio: incluyeEnvio,
    });
    const idpedido = resPedido.data.idpedido;

    // 4) Ahora recorro cada ítem del carrito y hago un POST separado a detalle_pedidos.
    //    Usamos Promise.all para enviarlos en paralelo y esperar a que todos terminen.
    await Promise.all(
      venta.map((item) =>
        axios.post("http://localhost:3001/api/detalle_pedidos", {
          idpedido,
          idcomida: item.idComida,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })
      )
    );

    toast.success("Pedido enviado con éxito");

    // 5) Limpio todo el estado para volver al inicio
    setVenta([]);
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
    <div>
      <h1>Realizar Venta</h1>

      <div style={{ marginBottom: "10px" }}>
        <select name="idComida" value={form.idComida} onChange={handleChange}>
          <option value="" disabled>
            Seleccioná una comida
          </option>
          {comidas.map((c) => (
            <option key={c.idComida} value={c.idComida}>
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
        <button onClick={() => setVenta([])}>Vaciar Carrito</button>
        <button onClick={() => setMostrarModal(true)}>Enviar Pedido</button>
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
              <td>{item.nombre}</td>
              <td>{item.precio}</td>
              <td>{item.cantidad}</td>
              <td>{item.subtotal}</td>
              <td>
                <button onClick={() => eliminarItem(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: ${total}</h2>

      {mostrarModal && (
        <div style={{ border: "1px solid gray", padding: 10, marginTop: 20 }}>
          <h2>Enviar Pedido</h2>
          <label>
            Cliente existente:
            <input
              type="checkbox"
              checked={clienteExistente}
              onChange={(e) => setClienteExistente(e.target.checked)}
            />
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
                  <option key={c.idcliente} value={c.idcliente}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <button onClick={enviarPedido} disabled={loading}>
                {loading ? "Enviando..." : "Confirmar Pedido"}
              </button>
              <button onClick={() => setMostrarModal(false)} disabled={loading}>
                Cancelar
              </button>
              <label>
                Incluye envío:
                <input
                  type="checkbox"
                  checked={incluyeEnvio}
                  onChange={(e) => setIncluyeEnvio(e.target.checked)}
                  disabled={loading}
                />
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
                  setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
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
             
              <button onClick={createClient}>Crear cliente</button>
            </div>
          )}
        </div>
      )}
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
