import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import tuviandaLogo from "../assets/tu-vianda.jpeg";

import { useAuth } from "../context/AuthContext"; // 👈 importar el hook useAuth

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth(); // 👈 usar función logout
  const navigate = useNavigate();
  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout(); // 👈 borra el token
    setIsOpen(false); // 👈 cierra el menú si está abierto
    navigate("/"); // 👈 redirige a la página de inicio
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/venta" className="navbar-logo">
          <img
            src={tuviandaLogo}
            alt="Logo de Tu Vianda"
            className="navbar-logo-img"
          />
        </Link>
        <button type="button" className="navbar-toggle" onClick={toggleNavbar}>
          <span className="navbar-toggle-icon"></span>
        </button>
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <ul className="navbar-list">
            <li>
              <Link to="/venta" className="navbar-link">Venta</Link>
            </li>
            <li>
              <Link to="/comidas" className="navbar-link">Comidas</Link>
            </li>
            <li>
              <Link to="/clientes" className="navbar-link">Clientes</Link>
            </li>
            <li>
              <Link to="/pedidos" className="navbar-link">Pedidos</Link>
            </li>
            <li>
              <Link to="/historial-ventas" className="navbar-link">
                Historial de Ventas
              </Link>
            </li>
            {location.pathname !== "/" && (
              <li
                onClick={handleLogout}
                className="navbar-link"
                style={{
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cerrar sesion
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
