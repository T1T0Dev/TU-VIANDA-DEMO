import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Clientes() {
  // Estados para manejar los clientes, formulario, modal y errores
  const [clientes, setClientes] = useState([]);
  const [clientesOriginales, setClientesOriginales] = useState([]);
  const [form, setForm] = useState({ nombre: "", direccion: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await axios.get("detalle_pedidos/clientes");
      // Elimina el campo telefono de cada cliente
      const clientesSinTelefono = res.data.map(({ telefono, ...rest }) => rest);
      setClientes(clientesSinTelefono);
      setClientesOriginales(clientesSinTelefono); // Guardar los clientes originales para restaurar al buscar
      setError(null); // Limpiar errores al cargar clientes
    } catch (error) {
      setError(
        "Error al cargar clientes. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al cargar clientes:", error);
    }
  };

  const abrirModalParaCrear = () => {
    setForm({ nombre: "", direccion: "" });
    setEditId(null);
    setModalVisible(true);
    setError(null);
    setTimeout(() => {
      document.querySelector('input[name="nombre"]').focus();
    }, 100);
  };

  const abrirModalParaEditar = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
    });
    setEditId(cliente.id);
    setModalVisible(true);
    setError(null);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setForm({ nombre: "", direccion: "" });
    setEditId(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      // Validar campos requeridos
      if (!form.nombre || !form.direccion) {
        setError("Todos los campos son obligatorios.");
        toast.error("Todos los campos son obligatorios.");
        return;
      }

      if (editId) {
        await axios.put(`/api/clientes/${editId}`, form);
        toast.success("Cliente actualizado exitosamente!");
      } else {
        await axios.post("/api/clientes", form);
        toast.success("Cliente creado exitosamente!");
      }
      cargarClientes();
      cerrarModal();
      setError(null);
      toast.success("Cliente guardado exitosamente!");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error al guardar cliente:", error);
        toast.error("Error al guardar cliente. Revisá la consola.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/clientes/${id}`);
      cargarClientes();
      setError(null);
      toast.success("Cliente eliminado exitosamente!");
    } catch (error) {
      setError(
        "Error al eliminar cliente. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al eliminar cliente:", error);
    }
  };

  return (
    <div className="container-crud">
      <h2>CLIENTES</h2>
      <button onClick={abrirModalParaCrear}>Agregar Cliente</button>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar cliente por nombre"
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();

          if (searchTerm === "") {
            setClientes(clientesOriginales);
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
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td data-label="Nombre">{cliente.nombre}</td>
              <td data-label="Direccion">{cliente.direccion}</td>
              <td>
                <button onClick={() => abrirModalParaEditar(cliente)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(cliente.id)}>
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
