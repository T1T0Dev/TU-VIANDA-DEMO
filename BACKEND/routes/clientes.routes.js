import express from "express";
import { getClientes, addCliente, deleteCliente, updateCliente } from "../controllers/clientes.controller.js";

const router = express.Router();

router.get("/", getClientes); // Obtener todos los clientes
router.post("/", addCliente); // Agregar un nuevo cliente
router.delete("/:id", deleteCliente); // Eliminar un cliente por ID
router.put("/:id", updateCliente); // Actualizar un cliente por ID

export default router;