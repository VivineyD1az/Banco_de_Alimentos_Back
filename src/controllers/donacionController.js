const { Donacion, Donante, Usuario, Producto, DonacionProducto } = require('../models/index');

const crearDonacionPublica = async (req, res) => {
  try {
    const { nombre_donante, correo_donante, producto, tipo, cantidad } = req.body;

    let donante = null;
    if (nombre_donante) {
      donante = await Donante.create({
        nombre_completo: nombre_donante,
        correo: correo_donante || null
      });
    }

    const donacion = await Donacion.create({
      usuario_id: 1,
      donante_id: donante ? donante.id : null,
      cantidad: cantidad || 0,
      fecha: new Date()
    });

    res.status(201).json({ mensaje: '¡Donación recibida con éxito!', donacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { crearDonacionPublica };