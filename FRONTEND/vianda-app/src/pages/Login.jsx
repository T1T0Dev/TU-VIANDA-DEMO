import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); // Obtener la función para actualizar el estado de autenticación

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.get("/api/usuarios", {
      params: {
        usuario,
        pass,
      },
    });

    if (res.data.length > 0) {
      const user = res.data[0];

      // Token simulado (solo para que no quede vacío)
      const fakeToken = btoa(`${user.usuario}:${user.pass}`);
      localStorage.setItem("token", fakeToken);

      setIsAuthenticated(true);
      console.log("Usuario autenticado:", user.usuario);

      navigate("/venta");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error.message);
    alert("Error al conectar con el servidor");
  }
};


  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        USUARIO: titodev CONTRASEÑA:viandas
      </h3>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
