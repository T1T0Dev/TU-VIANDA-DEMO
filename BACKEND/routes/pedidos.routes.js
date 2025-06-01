import express from "express";
import { getPedidos, addPedido, deletePedido, updateState,getPedidoDetalles } from "../controllers/pedidos.controller.js";

const router = express.Router();

router.get("/", getPedidos); // Obtener todos los pedidos}
router.post("/", addPedido); // Agregar un nuevo pedido
router.get("/detalles", getPedidoDetalles); 


// router.get ("/detalles/:id",getPedidoDetallesByID) // Obtener detalles de un pedido por ID (opcional, si se implementa en el controlador)

router.delete("/:id", deletePedido); // Eliminar un pedido por ID
router.put("/:id", updateState); // Actualizar el estado de un pedido por ID

export default router;

