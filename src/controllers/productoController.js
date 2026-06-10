const { Producto } = require('../models/index');
const { Op, fn, col, literal } = require('sequelize');

// Obtener todos los productos agrupados por nombre, categoría y tipo
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear producto
const crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Productos por vencer (próximos 7 días)
const productosPorVencer = async (req, res) => {
  try {
    const hoy = new Date();
    const en7dias = new Date();
    en7dias.setDate(hoy.getDate() + 7);

    const productos = await Producto.findAll({
      where: {
        fecha_vencimiento: {
          [require('sequelize').Op.between]: [hoy, en7dias]
        }
      }
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  productosPorVencer
};