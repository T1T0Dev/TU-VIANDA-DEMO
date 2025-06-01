import express from "express";
import { getDetallePedidos, addDetallePedido } from "../controllers/detallepedidos.controller.js";

const router = express.Router();

router.get("/", getDetallePedidos); // Obtener todos los detalles de pedidos
router.post("/", addDetallePedido); // Agregar un nuevo detalle de pedido

export default router;
