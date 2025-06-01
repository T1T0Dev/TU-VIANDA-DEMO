import db from "../db.js";

export const getVentasDetalles = async (req, res) => {
  const { fecha } = req.query;

  try {
    let query = `
      SELECT
        v.idventa        AS id_venta,
        v.fecha_venta    AS fecha_venta,
        p.idpedido       AS numero_pedido,
        cl.nombre        AS cliente,
        ROUND(SUM(dp.cantidad * dp.precio_unitario)) AS total_venta
      FROM ventas v
      JOIN pedidos p ON v.idpedido = p.idpedido
      JOIN clientes cl ON p.idcliente = cl.idcliente
      JOIN detalle_pedidos dp ON p.idpedido = dp.idpedido
    `;

    const params = [];

    if (fecha) {
      query += ` WHERE DATE(v.fecha_venta) = ?`;
      params.push(fecha);
    }

    query += `
      GROUP BY v.idventa, v.fecha_venta, p.idpedido, cl.nombre
      ORDER BY v.fecha_venta DESC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalle de ventas:", error);
    res.status(500).json({ message: "Error al obtener detalle de ventas" });
  }
};


export const addVentasDetalles = async (req, res) => {
    const { idpedido } = req.body;
    
    if (!idpedido) {
        return res.status(400).json({ message: "El idpedido es requerido" });
    }

    
    
    try {
        // Verificar si el pedido existe
        const [existingPedido] = await db.query("SELECT * FROM pedidos WHERE idpedido = ?", [idpedido]);
        if (existingPedido.length === 0) {
        return res.status(404).json({ message: "Pedido no encontrado" });
        }
    
        // Insertar la venta
        const [result] = await db.query(
        "INSERT INTO ventas (idpedido) VALUES (?)",
        [idpedido]
        );
    
        res.status(201).json({ idventa: result.insertId, idpedido});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar la venta" });
    }
    }
