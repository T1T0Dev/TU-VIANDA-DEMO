// middlewares/verifyToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // carga las variables de .env en process.env

export const verifyToken = (req, res, next) => {
  // 1) Revisar que venga el header Authorization
  const authHeader = req.headers["authorization"]; 
  if (!authHeader) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  // 2) Extraer el token de “Bearer <token>”
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(403).json({ message: "Token mal formado" });
  }
  const token = parts[1];

  // 3) Verificar con la misma clave secreta del .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    // 4) Si todo bien, guardamos el payload decodificado en req.user
    req.user = decoded;
    next();
  });
};
