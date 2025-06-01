import db from '../db.js';

export const getClientes = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          c.idcliente,
          c.nombre,
          c.telefono,
          c.direccion,
          COUNT(p.idpedido) AS total_pedidos,
          COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS total_gastado
        FROM clientes c
        LEFT JOIN pedidos p ON c.idcliente = p.idcliente
        LEFT JOIN detalle_pedidos dp ON p.idpedido = dp.idpedido
        GROUP BY
          c.idcliente,
          c.nombre,
          c.telefono,
          c.direccion
        ORDER BY total_pedidos DESC
      `);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los clientes' });
    }
  };
  

export const addCliente = async (req, res) => {
    const { nombre, telefono,direccion } = req.body;

    

    if (!nombre || !telefono || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (typeof nombre !== 'string' || typeof telefono !== 'string' || typeof direccion !== 'string') {
        return res.status(400).json({ message: 'Nombre, telefono y direccion deben ser cadenas de texto' });
    }

    if (nombre.trim() === '' || telefono.trim() === '' || direccion.trim() === '') {
        return res.status(400).json({ message: 'Nombre, telefono y direccion no pueden estar vacíos' });
    }

    
    try {
        // Verificar si el cliente ya existe por nombre y telefono
        const [existingCliente] = await db.query('SELECT * FROM clientes WHERE nombre = ? AND telefono = ?', [nombre, telefono]);
        if (existingCliente.length > 0) {
            return res.status(409).json({ message: 'El cliente ya existe con ese nombre y telefono' });
        }
        // Insertar el nuevo cliente
        const [result] = await db.query('INSERT INTO clientes (nombre, telefono,direccion) VALUES (?, ?, ?)', [nombre, telefono,direccion]);
        res.status(201).json({ idcliente: result.insertId, nombre, telefono,direccion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el cliente' });
    }
}

export const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM clientes WHERE idcliente = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
}

export const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;
    try {
        const [result] = await db.query('UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE idcliente = ?', [nombre, telefono, direccion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}
