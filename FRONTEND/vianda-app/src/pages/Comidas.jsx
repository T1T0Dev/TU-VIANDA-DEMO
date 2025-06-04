// src/pages/Comidas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Comidas() {
  const [comidas, setComidas] = useState([]);
  const [comidasOriginales, setComidasOriginales] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarComidas();
  }, []);

  const cargarComidas = async () => {
    try {
      const res = await axios.get("/api/comidas");
      setComidas(res.data);
      setComidasOriginales(res.data); // Guardar las comidas originales para restaurar al buscar
      setError(null); // Limpiar errores al cargar comidas
    } catch (error) {
      setError(
        "Error al cargar comidas. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al cargar comidas:", error);
      toast.error(
        "Error al cargar comidas. Por favor, inténtelo de nuevo más tarde."
      );
    }
  };

  const abrirModalParaCrear = () => {
    setForm({ nombre: "", precio: "" });
    setEditId(null);
    setModalVisible(true);
    setError(null); // Limpiar errores al abrir el modal
  };

  const abrirModalParaEditar = (comida) => {
    setForm({ nombre: comida.nombre, precio: comida.precio });
    setEditId(comida.id); // <-- Ya no usa Number
    setModalVisible(true);
    setError(null); // Limpiar errores al abrir el modal
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setForm({ nombre: "", precio: "" });
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
      // Ya no convierte precio a número
      const dataToSend = {
        nombre: form.nombre,
        precio: form.precio,
      };

      if (editId) {
        await axios.put(
          `/api/comidas/${editId}`,
          dataToSend
        );
        toast.success("Comida actualizada correctamente");
      } else {
        await axios.post("/api/comidas", dataToSend);
        toast.success("Comida agregada correctamente");
      }

      cargarComidas();
      setForm({ nombre: "", precio: "" });
    } catch (error) {
      console.error("Error al guardar comida:", error);
      setError(
        "Error al guardar comida. Por favor, inténtelo de nuevo más tarde."
      );
      toast.error(
        "Error al guardar comida. Por favor, inténtelo de nuevo más tarde."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/comidas/${id}`);
      toast.success("Comida eliminada correctamente");
      cargarComidas();
    } catch (error) {
      console.error("Error al eliminar comida:", error);
      setError(
        "Error al eliminar comida. Por favor, inténtelo de nuevo más tarde."
      );
      toast.error(
        "Error al eliminar comida. Por favor, inténtelo de nuevo más tarde."
      );
    }
  };

  return (
    <div className="container-crud">
      <h2>GESTION DE COMIDAS</h2>
      <button onClick={abrirModalParaCrear}>Agregar comida</button>

      <input
        className="search-input"
        type="text"
        placeholder="Buscar comida por nombre"
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();
          if (searchTerm === "") {
            setComidas(comidasOriginales); // restaurar todo si está vacío
          } else {
            const comidasFiltradas = comidasOriginales.filter((comida) =>
              comida.nombre.toLowerCase().includes(searchTerm)
            );
            setComidas(comidasFiltradas);
          }
          setError(null); // Limpiar errores al buscar
        }}
      />

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comidas.map((comida) => (
            <tr key={comida.id}>
              <td data-label="Nombre">{comida.nombre}</td>
              <td data-label="Precio">${comida.precio}</td>
              <td data-label="Acciones">
                <button onClick={() => abrirModalParaEditar(comida)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(comida.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="modal-overlay">
          {/* Evitar que el click en el modal cierre el modal */}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId ? "Editar Comida" : "Agregar Nueva Comida"}</h3>

            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Milanesa con papas"
            />

            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 1200"
              min="0"
            />

            {error && <p className="label-error">{error}</p>}

            <div style={{ marginTop: "16px" }}>
              <button onClick={handleSubmit}>
                {editId ? "Actualizar" : "Guardar"}
              </button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
