// index.js
import express from "express";
import cors from "cors";
import comidasRoutes from "./routes/comidas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import detallePedidosRoutes from "./routes/detallepedidos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js"; // Asegúrate de tener este archivo creado
import authRoutes from "./routes/auth.routes.js"; // Importa las rutas de autenticación si las tienes


const app = express();

app.use(cors());
app.use(express.json());

// CRUD 
app.use("/api/comidas", comidasRoutes); 
app.use("/api/clientes", clientesRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/detallepedidos", detallePedidosRoutes);
app.use("/api/ventas", ventasRoutes); // Ruta para las ventas

// Rutas de autenticación
app.use("/api/auth", authRoutes); // Ruta para autenticación, si la tienes



const PORT = process.env. PORT ?? 3001; // Puerto por defecto 3001


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
