import express from "express";
import { getVentasDetalles,addVentasDetalles} from "../controllers/ventas.controller.js";


const router = express.Router();

// Obtener todas las ventas con detalles
router.get("/detalles", getVentasDetalles); // Obtener todas las ventas con detalles
router.post("/", addVentasDetalles); // Agregar una nueva venta (opcional, si se implementa en el controlador)

// router.get("/:id", getVentaDetallesByID); // Obtener detalles de una venta por ID (opcional, si se implementa en el controlador)


export default router;
