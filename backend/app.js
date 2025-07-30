const express = require('express');
const path = require('path');
const { testConnection } = require('./config/database');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Ruta raíz para servir login.html
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
app.get('/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ status: 'success', message: 'Conexión a la base de datos exitosa' });
  } else {
    res.status(500).json({ status: 'error', message: 'Error al conectar a la base de datos' });
  }
});

// Ruta de prueba básica
app.get('/test', (req, res) => {
  res.send('API de TiendaSoftware funcionando correctamente');
});



app.get('/api/tabla', async (req, res) => {
  try {
    // Reemplaza 'nombre_tabla' con el nombre de tu tabla
    const [results] = await db.query('SELECT * FROM ');
    res.json(results);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
  // Probar la conexión a la base de datos al iniciar
  testConnection().then(connected => {
    if (!connected) {
      console.error('No se pudo conectar a la base de datos. Verifica la configuración en .env');
    }
  });
});

module.exports = app;