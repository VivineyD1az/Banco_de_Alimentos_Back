const { sequelize, Usuario, Producto, Donante, Donacion, DonacionProducto } = require('./src/models/index');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: false });
    console.log('--- Iniciando Seed Extendido ---');

    // 1. Usuarios
    const pass = await bcrypt.hash('password123', 10);
    const usersData = [
      { nombre_completo: 'Admin Usuario', correo: 'admin@bancoalimentos.org', rol: 'administrador', password: pass, telefono: '+34 600 000 000' },
      { nombre_completo: 'Elena Martínez', correo: 'elena.mtz@foodbank.org', rol: 'voluntario', password: pass, telefono: '555-0101' },
      { nombre_completo: 'Javier Solís', correo: 'javier.vol@foodbank.org', rol: 'voluntario', password: pass, telefono: '555-0102' },
      { nombre_completo: 'Rosa Luna', correo: 'rosa.luna@foodbank.org', rol: 'voluntario', password: pass, telefono: '555-0103' }
    ];

    for (const u of usersData) {
      await Usuario.findOrCreate({ where: { correo: u.correo }, defaults: u });
    }
    console.log('✅ Usuarios creados');

    const admin = await Usuario.findOne({ where: { correo: 'admin@bancoalimentos.org' } });

    // 2. Productos
    const productosData = [
      { nombre: 'Arroz', categoria: 'Granos', tipo: 'no_perecedero', cantidad: 150, estado: 'disponible' },
      { nombre: 'Leche', categoria: 'Lácteos', tipo: 'perecedero', cantidad: 80, estado: 'disponible' },
      { nombre: 'Lentejas', categoria: 'Granos', tipo: 'no_perecedero', cantidad: 200, estado: 'disponible' },
      { nombre: 'Manzanas', categoria: 'Frutas', tipo: 'perecedero', cantidad: 45, estado: 'disponible' },
      { nombre: 'Atún en lata', categoria: 'Conservas', tipo: 'no_perecedero', cantidad: 300, estado: 'disponible' }
    ];

    for (const p of productosData) {
      await Producto.findOrCreate({ where: { nombre: p.nombre }, defaults: p });
    }
    console.log('✅ Productos creados');

    // 3. Donantes
    const donantesData = [
      { nombre_completo: 'Juan Pérez', correo: 'juan.perez@email.com', telefono: '555-0201', direccion: 'Calle Mayor 10' },
      { nombre_completo: 'María García', correo: 'maria.g@email.com', telefono: '555-0202', direccion: 'Av. Libertad 45' },
      { nombre_completo: 'Supermercado Central', correo: 'contacto@central.com', telefono: '555-9000', direccion: 'Zona Industrial Nave 4' },
      { nombre_completo: 'Anónimo', correo: 'anonimo@bancoalimentos.org' }
    ];

    for (const d of donantesData) {
      await Donante.findOrCreate({ where: { nombre_completo: d.nombre_completo }, defaults: d });
    }
    console.log('✅ Donantes creados');

    // 4. Donaciones
    const donantes = await Donante.findAll();
    const productos = await Producto.findAll();

    for (let i = 0; i < 5; i++) {
      const donacion = await Donacion.create({
        usuario_id: admin.id,
        donante_id: donantes[i % donantes.length].id,
        cantidad: Math.floor(Math.random() * 50) + 10,
        fecha: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Últimos 5 días
      });

      await DonacionProducto.create({
        donacion_id: donacion.id,
        producto_id: productos[i % productos.length].id
      });
    }
    console.log('✅ Donaciones de prueba creadas');

    console.log('--- Seed completado con éxito ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}


seed();
