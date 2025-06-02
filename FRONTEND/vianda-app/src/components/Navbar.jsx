import { Link } from "react-router-dom";
import { useState } from "react";
import tuviandaLogo from "../assets/tu-vianda.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

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
              <Link to="/venta" className="navbar-link">
                Venta
              </Link>
            </li>
            <li>
              <Link to="/comidas" className="navbar-link">
                Comidas
              </Link>
            </li>
            <li>
              <Link to="/clientes" className="navbar-link">
                Clientes
              </Link>
            </li>
            <li>
              <Link to="/pedidos" className="navbar-link">
                Pedidos
              </Link>
            </li>
            <li>
              <Link to="/historial-ventas" className="navbar-link">
                Historial de Ventas
              </Link>
            </li>
            <li>
              <Link to="/" 
              className="navbar-link">
              Cerrar Sesion
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
