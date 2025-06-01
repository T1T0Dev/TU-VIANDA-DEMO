import db from '../db.js';

export const getComidas = async (req, res) => {
  try {
    // Supongamos que tu tabla realmente es `comidas` y la PK es `idComida`
    const [rows] = await db.query('SELECT * FROM comidas');
    // Cada objeto en rows ya viene con { idComida, nombre, precio }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las comidas' });
  }
}

export const addComida = async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    // Insertamos en `comidas (nombre, precio)`
    const [result] = await db.query(
      'INSERT INTO comidas (nombre, precio) VALUES (?, ?)',
      [nombre, precio]
    );
    // Devolvemos idComida, no "id":
    res.status(201).json({
      idComida: result.insertId,
      nombre,
      precio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar la comida' });
  }
}

export const deleteComida = async (req, res) => {
  const { id } = req.params;
  try {
    // Aclaramos que la columna se llama idComida
    const [result] = await db.query(
      'DELETE FROM comidas WHERE idComida = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }
    res.json({ message: 'Comida eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la comida' });
  }
}

export const updateComida = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  try {
    // Actualizamos también usando la columna idComida
    const [result] = await db.query(
      'UPDATE comidas SET nombre = ?, precio = ? WHERE idComida = ?',
      [nombre, precio, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }
    res.json({ message: 'Comida actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la comida' });
  }
}
