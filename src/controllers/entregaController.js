const { Entrega, Beneficiario, Producto, EntregaProducto } = require('../models/index');

const obtenerEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.findAll({
      include: [
        { model: Beneficiario },
        { model: Producto }
      ]
    });
    res.json(entregas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerEntregaPorId = async (req, res) => {
  try {
    const entrega = await Entrega.findByPk(req.params.id, {
      include: [
        { model: Beneficiario },
        { model: Producto }
      ]
    });
    if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });
    res.json(entrega);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearEntrega = async (req, res) => {
  try {
    const { beneficiario_id, fecha, productos } = req.body;
    const entrega = await Entrega.create({ beneficiario_id, fecha });

    if (productos && productos.length > 0) {
      await Promise.all(productos.map(p =>
        EntregaProducto.create({
          entrega_id: entrega.id,
          producto_id: p.producto_id,
          cantidad: p.cantidad || 0
        })
      ));
    }

    res.status(201).json(entrega);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarEntrega = async (req, res) => {
  try {
    const entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });
    await entrega.update(req.body);
    res.json(entrega);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarEntrega = async (req, res) => {
  try {
    const entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });
    await entrega.destroy();
    res.json({ mensaje: 'Entrega eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerEntregas,
  obtenerEntregaPorId,
  crearEntrega,
  actualizarEntrega,
  eliminarEntrega
};