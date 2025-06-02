import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Clientes() {
  // Estados para manejar los clientes, formulario, modal y errores
  const [clientes, setClientes] = useState([]);
  const [clientesOriginales, setClientesOriginales] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "", direccion: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/clientes");
      setClientes(res.data);
      setClientesOriginales(res.data); // Guardar los clientes originales para restaurar al buscar
      setError(null); // Limpiar errores al cargar clientes
    } catch (error) {
      // Manejo de errores al cargar clientes
      setError(
        "Error al cargar clientes. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al cargar clientes:", error);
    }
  };

  const abrirModalParaCrear = () => {
    setForm({ nombre: "", telefono: "", direccion: "" });
    setEditId(null);
    setModalVisible(true);
    setError(null); // Limpiar errores al abrir el modal
    setTimeout(() => {
      document.querySelector('input[name="nombre"]').focus(); // Enfocar el primer campo del formulario
    }, 100); // Esperar un poco para asegurar que el modal esté visible
  };

  const abrirModalParaEditar = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setEditId(cliente.idcliente);
    setModalVisible(true);
    setError(null); // Limpiar errores al abrir el modal
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setForm({ nombre: "", telefono: "", direccion: "" });
    setEditId(null);
    setError(null); // Limpiar errores al cerrar el modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null); // Limpiar errores al cambiar el formulario
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:3001/api/clientes/${editId}`, form);
        toast.success("Cliente actualizado exitosamente!"); // Notificación de éxito
      } else {
        await axios.post("http://localhost:3001/api/clientes", form);
        toast.success("Cliente creado exitosamente!"); // Notificación de éxito
      }
      cargarClientes();
      cerrarModal(); // Cerrar modal después de guardar
      setError(null); // Limpiar errores al guardar cliente
      toast.success("Cliente guardado exitosamente!"); // Notificación de éxito
    } catch (error) {
      if (error.response?.status === 409) {
        // El backend devolvió “Conflict” porque ya existe un cliente con ese nombre+teléfono
        toast.error(error.response.data.message);
      } else {
        console.error("Error al guardar cliente:", error);
        toast.error("Error al guardar cliente. Revisá la consola.");
      }
    }
  };

  const handleDelete = async (idcliente) => {
    try {
      await axios.delete(`http://localhost:3001/api/clientes/${idcliente}`);
      cargarClientes();
      setError(null); // Limpiar errores al eliminar cliente
      toast.success("Cliente eliminado exitosamente!"); // Notificación de éxito
    } catch (error) {
      // Manejo de errores al eliminar cliente
      setError(
        "Error al eliminar cliente. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al eliminar cliente:", error);
    }
  };

  return (
    <div>
      <h2>CLIENTES</h2>
      <button onClick={abrirModalParaCrear}>Agregar Cliente</button>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar cliente por nombre"
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();

          if (searchTerm === "") {
            setClientes(clientesOriginales); // Restaurar todo
            setError(null);
          } else {
            const filteredClientes = clientesOriginales.filter((cliente) =>
              cliente.nombre.toLowerCase().includes(searchTerm)
            );
            setClientes(filteredClientes);

            if (filteredClientes.length === 0) {
              setError("No se encontraron clientes con ese nombre.");
            } else {
              setError(null);
            }
          }
        }}
      />

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editId ? "Editar Cliente" : "Agregar Cliente"}</h2>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>
              {editId ? "Actualizar" : "Crear"}
            </button>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
      {/* Mostrar como tabla */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Total Pedidos</th>
            <th>Total Gastado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.idcliente}>
              <td data-label="ID">{cliente.idcliente}</td>
              <td data-label="Nombre">{cliente.nombre}</td>
              <td data-label="Telefono">{cliente.telefono}</td>
              <td data-label="Direccion">{cliente.direccion}</td>
              <td data-label="Total Pedidos">{cliente.total_pedidos}</td>
              <td data-label="Total Gastado">{cliente.total_gastado}</td>

              <td>
                <button onClick={() => abrirModalParaEditar(cliente)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(cliente.idcliente)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
