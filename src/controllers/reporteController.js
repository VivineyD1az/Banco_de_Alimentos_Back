const { Op } = require('sequelize');
const { sequelize, Producto, Donacion, Donante, Entrega, Beneficiario } = require('../models/index');

// Productos por vencer en los próximos N días
const productosPorVencer = async (req, res) => {
  try {
    const dias = req.query.dias || 7;
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + parseInt(dias));

    const productos = await Producto.findAll({
      where: {
        fecha_vencimiento: {
          [Op.between]: [hoy, limite]
        }
      },
      order: [['fecha_vencimiento', 'ASC']]
    });

    res.json({
      total: productos.length,
      dias_consultados: dias,
      productos
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Productos con stock bajo
const productosStockBajo = async (req, res) => {
  try {
    const limite = req.query.limite || 10;

    const productos = await Producto.findAll({
      where: {
        cantidad: {
          [Op.lte]: parseFloat(limite)
        }
      },
      order: [['cantidad', 'ASC']]
    });

    res.json({
      total: productos.length,
      limite_consultado: limite,
      productos
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total donaciones por donante
const donacionesPorDonante = async (req, res) => {
  try {
    const donaciones = await Donacion.findAll({
      include: [{ model: Donante, attributes: ['nombre_completo', 'correo'] }],
      attributes: [
        'donante_id',
        [sequelize.fn('COUNT', sequelize.col('Donacion.id')), 'total_donaciones'],
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidad_total']
      ],
      group: ['donante_id', 'Donante.id'],
      order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']]
    });

    res.json({
      total_donantes: donaciones.length,
      donaciones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Entregas por beneficiario
const entregasPorBeneficiario = async (req, res) => {
  try {
    const entregas = await Entrega.findAll({
      include: [{ model: Beneficiario, attributes: ['nombre', 'tipo'] }],
      attributes: [
        'beneficiario_id',
        [sequelize.fn('COUNT', sequelize.col('Entrega.id')), 'total_entregas']
      ],
      group: ['beneficiario_id', 'Beneficiario.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Entrega.id')), 'DESC']]
    });

    res.json({
      total_beneficiarios: entregas.length,
      entregas
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resumen general del sistema
const resumenGeneral = async (req, res) => {
  try {
    const totalProductos = await Producto.count();
    const totalDonaciones = await Donacion.count();
    const totalDonantes = await Donante.count();
    const totalEntregas = await Entrega.count();
    const totalBeneficiarios = await Beneficiario.count();

    const hoy = new Date();
    const en7dias = new Date();
    en7dias.setDate(hoy.getDate() + 7);

    const productosPorVencer = await Producto.count({
      where: {
        fecha_vencimiento: {
          [Op.between]: [hoy, en7dias]
        }
      }
    });

    const stockBajo = await Producto.count({
      where: {
        cantidad: { [Op.lte]: 10 }
      }
    });

    res.json({
      resumen: {
        total_productos: totalProductos,
        total_donaciones: totalDonaciones,
        total_donantes: totalDonantes,
        total_entregas: totalEntregas,
        total_beneficiarios: totalBeneficiarios,
      },
      alertas: {
        productos_por_vencer_7dias: productosPorVencer,
        productos_stock_bajo: stockBajo
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  productosPorVencer,
  productosStockBajo,
  donacionesPorDonante,
  entregasPorBeneficiario,
  resumenGeneral
};