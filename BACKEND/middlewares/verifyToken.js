// middlewares/verifyToken.js
import jwt from "jsonwebtoken";
import { SECRET } from "../controllers/auth.controller.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido o expirado" });

    req.user = decoded;
    next();
  });
};
