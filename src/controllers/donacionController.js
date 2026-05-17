const { Donacion, Donante, Usuario, Producto, DonacionProducto } = require('../models/index');

const obtenerDonaciones = async (req, res) => {
  try {
    const donaciones = await Donacion.findAll({
      include: [
        { model: Donante },
        { model: Usuario },
        { model: Producto }
      ]
    });
    res.json(donaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerDonacionPorId = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id, {
      include: [
        { model: Donante },
        { model: Usuario },
        { model: Producto }
      ]
    });
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    res.json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearDonacion = async (req, res) => {
  try {
    const { usuario_id, donante_id, cantidad, fecha, productos } = req.body;
    const donacion = await Donacion.create({ usuario_id, donante_id, cantidad, fecha });

    if (productos && productos.length > 0) {
      await Promise.all(productos.map(p =>
        DonacionProducto.create({
          donacion_id: donacion.id,
          producto_id: p.producto_id
        })
      ));
    }

    res.status(201).json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearDonacionPublica = async (req, res) => {
  try {
    const { producto, tipo, cantidad, unidad, donante } = req.body;

    if (!producto || !tipo || !cantidad) {
      return res.status(400).json({ error: 'Producto, tipo y cantidad son obligatorios' });
    }

    const tipoNormalizado = typeof tipo === 'string'
      ? tipo.toLowerCase().trim()
      : '';

    // 1. Manejar Donante
    let donante_id = null;
    if (donante && donante.nombre_completo) {
      const [nuevoDonante] = await Donante.findOrCreate({
        where: { correo: donante.correo || 'anonimo@bancoalimentos.org' },
        defaults: {
          nombre_completo: donante.nombre_completo,
          telefono: donante.telefono,
          direccion: donante.direccion
        }
      });
      donante_id = nuevoDonante.id;
    } else {
      // Donación Anónima - Buscamos o creamos un donante "Anónimo"
      const [anonimo] = await Donante.findOrCreate({
        where: { nombre_completo: 'Anónimo' },
        defaults: { correo: 'anonimo@bancoalimentos.org' }
      });
      donante_id = anonimo.id;
    }

    // 2. Crear Producto (Temporal/Pendiente)
    const nuevoProducto = await Producto.create({
      nombre: producto,
      tipo: tipoNormalizado === 'perecedero' ? 'perecedero' : 'no_perecedero',
      cantidad: cantidad,
      estado: 'pendiente' // Las donaciones públicas quedan pendientes de revisión
    });

    // 3. Crear Donación sin usuario asociado
    const donacion = await Donacion.create({
      donante_id,
      usuario_id: null,
      cantidad,
      fecha: new Date()
    });

    // 4. Vincular Producto
    await DonacionProducto.create({
      donacion_id: donacion.id,
      producto_id: nuevoProducto.id
    });

    res.status(201).json({ mensaje: 'Donación recibida correctamente', donacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


const actualizarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    await donacion.update(req.body);
    res.json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    await donacion.destroy();
    res.json({ mensaje: 'Donación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerDonaciones,
  obtenerDonacionPorId,
  crearDonacion,
  crearDonacionPublica,
  actualizarDonacion,
  eliminarDonacion
};