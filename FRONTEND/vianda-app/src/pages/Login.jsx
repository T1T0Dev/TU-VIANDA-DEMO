import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Esto es clave para evitar el GET automático

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        usuario,
        pass
      });


      localStorage.setItem("token", res.data.token); // Guardar el token en localStorage

      navigate("/venta"); // Redirigir a la página principal o donde quieras
      // Redireccionar o guardar token, etc.
    } catch (error) {
      console.error("Error de login:", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
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
