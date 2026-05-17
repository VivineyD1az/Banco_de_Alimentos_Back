const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./src/models/index');

const app = express();

app.use(cors());
app.use(express.json());
const productoRoutes = require('./src/routes/productoRoutes');
app.use('/api/productos', productoRoutes);
const donanteRoutes = require('./src/routes/donanteRoutes');
app.use('/api/donantes', donanteRoutes);
const beneficiarioRoutes = require('./src/routes/beneficiarioRoutes');
app.use('/api/beneficiarios', beneficiarioRoutes);

const donacionRoutes = require('./src/routes/donacionRoutes');
app.use('/api/donaciones', donacionRoutes);

const entregaRoutes = require('./src/routes/entregaRoutes');
app.use('/api/entregas', entregaRoutes);

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const reporteRoutes = require('./src/routes/reporteRoutes');
app.use('/api/reportes', reporteRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const dashboardRoutes = require('./src/routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: '🎉 Servidor banco de alimentos funcionando!' });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a: ${process.env.DB_HOST}`);
    await sequelize.sync({ alter: true });

    // Alter table to allow null usuario_id
    await sequelize.query('ALTER TABLE donaciones ALTER COLUMN usuario_id DROP NOT NULL;');
    console.log('✅ Columna usuario_id actualizada para permitir NULL');

    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
  }
}

iniciarServidor();