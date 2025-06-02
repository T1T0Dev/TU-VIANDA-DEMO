import bcryptjs from "bcryptjs";
import db from "./db.js"; // tu conexión a MySQL

const crearUsuario = async () => {
  const usuario = "Noelia";
  const contraseña = "thi10juana2noe";

  const hash = await bcryptjs.hash(contraseña, 10);

  await db.query(
    "INSERT INTO usuarios (usuario, pass) VALUES (?, ?)",
    [usuario, hash]
  );

  console.log("Usuario creado con contraseña hasheada 😎");
};

crearUsuario();
