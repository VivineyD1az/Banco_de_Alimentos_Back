const { Op } = require('sequelize');
const { Producto, Donacion, Entrega, Beneficiario, Donante } = require('../models/index');

const obtenerEstadisticas = async (req, res) => {
  try {
    const hoy = new Date();

    // --- Total de productos en kg ---
    const productos = await Producto.findAll();
    const totalKg = productos.reduce((acc, p) => acc + (p.cantidad || 0), 0);

    // --- Próximos a vencer (próximos 7 días) ---
    const en7dias = new Date();
    en7dias.setDate(hoy.getDate() + 7);
    const porVencer = await Producto.count({
      where: {
        fecha_vencimiento: {
          [Op.between]: [hoy, en7dias]
        }
      }
    });

    // --- Productos vencidos ---
    const vencidos = await Producto.count({
      where: {
        fecha_vencimiento: {
          [Op.lt]: hoy
        }
      }
    });

    // --- Donaciones del mes actual ---
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    const donacionesMes = await Donacion.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioMes, finMes]
        }
      }
    });
    const totalDonacionesMes = donacionesMes.reduce((acc, d) => acc + (d.cantidad || 0), 0);

    // --- Total donantes registrados ---
    const totalDonantes = await Donante.count();

    // --- Total beneficiarios ---
    const totalBeneficiarios = await Beneficiario.count();

    // --- Entregas del mes ---
    const entregasMes = await Entrega.count({
      where: {
        fecha: {
          [Op.between]: [inicioMes, finMes]
        }
      }
    });

    // --- Últimas 5 donaciones ---
    const ultimasDonaciones = await Donacion.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Donante }]
    });

    // --- Últimas 5 entregas ---
    const ultimasEntregas = await Entrega.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Beneficiario }]
    });

    res.json({
      inventario: {
        total_kg: totalKg,
        total_productos: productos.length,
        por_vencer: porVencer,
        vencidos
      },
      donaciones: {
        total_mes_kg: totalDonacionesMes,
        total_donantes: totalDonantes,
        ultimas: ultimasDonaciones
      },
      entregas: {
        total_mes: entregasMes,
        total_beneficiarios: totalBeneficiarios,
        ultimas: ultimasEntregas
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reporte de productos por categoría
const productosPorCategoria = async (req, res) => {
  try {
    const { sequelize } = require('../models/index');
    const resultado = await Producto.findAll({
      attributes: [
        'categoria',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad_items']
      ],
      group: ['categoria']
    });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reporte donaciones por mes
const donacionesPorMes = async (req, res) => {
  try {
    const { sequelize } = require('../models/index');
    const resultado = await Donacion.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('Donacion.id')), 'num_donaciones']
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha')), 'ASC']]
    });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reporte entregas por beneficiario
const entregasPorBeneficiario = async (req, res) => {
  try {
    const entregas = await Entrega.findAll({
      include: [{ model: Beneficiario }],
      order: [['fecha', 'DESC']]
    });

    const resumen = {};
    entregas.forEach(e => {
      const nombre = e.Beneficiario?.nombre || 'Desconocido';
      if (!resumen[nombre]) {
        resumen[nombre] = { beneficiario: nombre, tipo: e.Beneficiario?.tipo, total_entregas: 0 };
      }
      resumen[nombre].total_entregas++;
    });

    res.json(Object.values(resumen));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerEstadisticas,
  productosPorCategoria,
  donacionesPorMes,
  entregasPorBeneficiario
};