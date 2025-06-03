import "./App.css";
import Comidas from "./pages/Comidas";
import Venta from "./pages/Venta";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import HistorialVentas from "./pages/HistorialVentas";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="venta"
            element={
              <ProtectedRoute>
                <Venta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comidas"
            element={
              <ProtectedRoute>
                <Comidas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial-ventas"
            element={
              <ProtectedRoute>
                <HistorialVentas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
