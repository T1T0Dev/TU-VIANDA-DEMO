import "./App.css";
import Comidas from "./pages/Comidas";
import Venta from "./pages/Venta";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import HistorialVentas from "./pages/HistorialVentas";
import Login from "./pages/Login";

import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login sin navbar */}
        <Route path="/" element={<Login />} />

        {/* Agrupamos todas las rutas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/venta" element={<Venta />} />
          <Route path="/comidas" element={<Comidas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/historial-ventas" element={<HistorialVentas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
