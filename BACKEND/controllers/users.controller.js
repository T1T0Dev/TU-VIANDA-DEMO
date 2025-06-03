// controllers/users.controller.js
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { usuario, pass } = req.body;
  if (!usuario || !pass) {
    return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
  }
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user.idusuario, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
