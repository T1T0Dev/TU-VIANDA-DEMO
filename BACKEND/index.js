// index.js
import express from "express";
import cors from "cors";
import comidasRoutes from "./routes/comidas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import detallePedidosRoutes from "./routes/detallepedidos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js"; // Asegúrate de tener este archivo creado


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/comidas", comidasRoutes); 
app.use("/api/clientes", clientesRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/detallepedidos", detallePedidosRoutes);
app.use("/api/ventas", ventasRoutes); // Ruta para las ventas



const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
