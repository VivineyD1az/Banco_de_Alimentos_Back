const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./src/models/index');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const donacionRoutes = require('./src/routes/donacionRoutes');
app.use('/api/donaciones', donacionRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🎉 Backend Banco de Alimentos funcionando!' });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
  }
}

iniciarServidor();