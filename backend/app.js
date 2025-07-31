const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Importaciones de rutas
const personasRoutes = require('./routes/personasroutes');
const { testConnection } = require('./config/database');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Rutas API
app.use('/api/personas', personasRoutes);

// Rutas de vistas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/principal', (req, res) => {
  res.sendFile(path.join(__dirname, '../modulo/principal.html'));
});

app.get('/correos', (req, res) => {
  res.sendFile(path.join(__dirname, '../modulo/correos.html'));
});

app.get('/hola', (req, res) => {
  res.sendFile(path.join(__dirname, '../modulo/hola.html'));
});

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ 
        status: 'success', 
        message: 'Conexión a la base de datos exitosa',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No se pudo conectar a la base de datos');
    }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al conectar a la base de datos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta de prueba básica
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'API de TiendaSoftware funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
const server = app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
  // Probar la conexión a la base de datos al iniciar
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('⚠️  No se pudo conectar a la base de datos. Verifica la configuración en .env');
    } else {
      console.log('✅  Conexión a la base de datos exitosa');
    }
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
});

// Manejo de cierre de la aplicación
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;