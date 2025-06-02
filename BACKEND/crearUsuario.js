import bcryptjs from "bcryptjs";
import db from "./db.js"; // tu conexión a MySQL

const crearUsuario = async () => {
  const usuario = "admin";
  const contraseña = "Thi10Juana2Noe";

  const hash = await bcryptjs.hash(contraseña, 10);

  await db.query(
    "INSERT INTO usuarios (usuario, contraseña) VALUES (?, ?)",
    [usuario, hash]
  );

  console.log("Usuario creado con contraseña hasheada 😎");
};

crearUsuario();
