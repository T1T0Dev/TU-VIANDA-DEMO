import express from "express";
import { getComidas, addComida, deleteComida, updateComida } from "../controllers/comidas.controller.js";


const router = express.Router();

router.get("/", getComidas); // Obtener todas las comidas
router.post("/", addComida); // Agregar una nueva comida
router.delete("/:id", deleteComida); // Eliminar una comida por ID
router.put("/:id", updateComida); // Actualizar una comida por ID


export default router;

