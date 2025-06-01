import db from '../db.js';

export const getDetallePedidos= async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM detalle_pedidos');
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los detalles de pedidos' });
        
    }
}


export const addDetallePedido = async (req, res) => {

    const { idpedido, idcomida, cantidad, precio_unitario } = req.body;
    try {
        if (!idpedido || !idcomida || !cantidad || !precio_unitario) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        if (isNaN(cantidad) || isNaN(precio_unitario) || cantidad <= 0 || precio_unitario <= 0) {
            return res.status(400).json({ message: 'Cantidad y precio unitario deben ser números positivos' });
        }

        const [existingPedido] = await db.query('SELECT * FROM pedidos WHERE idpedido = ?', [idpedido]);
        if (existingPedido.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const [existingComida] = await db.query('SELECT * FROM comidas WHERE idcomida = ?', [idcomida]);
        if (existingComida.length === 0) {
            return res.status(404).json({ message: 'Comida no encontrada' });
        }

        const [result] = await db.query('INSERT INTO detalle_pedidos (idpedido, idcomida, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [idpedido, idcomida, cantidad, precio_unitario]);
        res.status(201).json({ iddetallepedido: result.insertId, idpedido, idcomida, cantidad, precio_unitario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el detalle del pedido' });
    }
}
