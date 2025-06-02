// Login.jsx
import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        usuario,
        contraseña,
      });

      // Guardamos el token en localStorage
      localStorage.setItem("token", res.data.token);

      // Llamamos función del padre (opcional)
      if (onLogin) onLogin(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Mensaje del backend
      } else {
        setError("Error de conexión");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <br />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
