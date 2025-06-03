import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import comidasRoutes from "./routes/comidas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import detallePedidosRoutes from "./routes/detallepedidos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// Rutas de autenticación (sin verifyToken)
app.use("/api/auth", authRoutes);

// Aplica verifyToken a todas las rutas siguientes
// app.use(verifyToken);

// CRUD (todas protegidas)
app.use("/api/comidas", comidasRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/detallepedidos", detallePedidosRoutes);
app.use("/api/ventas", ventasRoutes);

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
