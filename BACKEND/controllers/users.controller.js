import db from '../db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


const SECRET = "mi_secreto_super_seguro"; // Cambia esto por un secreto más seguro en producción

export const loginUser = async (req, res) => {
     const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ message: "Usuario y contraseña obligatorios" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

    if (rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const user = rows[0];

    const passwordOk = await bcryptjs.compare(contraseña, user.contraseña);

    if (!passwordOk) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ idusuario: user.idusuario, usuario: user.usuario }, SECRET, {
      expiresIn: "3h",
    });

    res.json({ token, usuario: user.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
