import db from '../db.js';

export const getPedidos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
}

export const addPedido = async (req, res) => {
    const { idcliente, incluye_envio } = req.body;

    if (!idcliente) {
        return res.status(400).json({ message: 'Falta el ID del cliente' });
    }

  

    try {
        const [result] = await db.query('INSERT INTO pedidos (idcliente, incluye_envio) VALUES (?, ?)', [idcliente, incluye_envio]);
        res.status(201).json({ idpedido: result.insertId, idcliente, incluye_envio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el pedido' });
    }
}

export const deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM pedidos WHERE idpedido = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
}

export const updateState = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('UPDATE pedidos SET estado = "entregado" WHERE idpedido = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json({ message: 'Estado del pedido actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
    }
}


export const getPedidoDetalles = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          p.idpedido                             AS numero_pedido,
          c.nombre                               AS cliente,
          com.nombre                             AS comida,
          dp.precio_unitario                     AS preciounitario,
          dp.cantidad                            AS cantidad,
          (dp.cantidad * dp.precio_unitario)     AS subtotal,
          p.estado                               AS estado,
          p.incluye_envio                        AS envio,
          p.fecha                                AS fecha_pedido
        FROM pedidos p
        JOIN clientes c   ON p.idcliente = c.idcliente
        JOIN detalle_pedidos dp ON p.idpedido = dp.idpedido
        JOIN comidas com  ON dp.idcomida = com.idcomida
        ORDER BY p.fecha 
      `);
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener detalle de pedidos:", error);
      res.status(500).json({ message: "Error al obtener detalle de pedidos" });
    }
  };
