const express = require('express');
const morgan = require('morgan'); // Middleware externo para logging
const cors = require('cors'); // Middleware externo para CORS
const app = express();

// Middlewares incorporados
app.use(express.json()); // Parsea JSON
app.use(express.urlencoded({ extended: true })); // Parsea URL-encoded
app.use(express.static('public')); // Sirve archivos estáticos

// Middleware externo para logging
app.use(morgan('dev'));

// Middleware externo para CORS
app.use(cors());

// Middleware personalizado para registrar solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! Este es mi primer servidor backend.');
});

app.get('/about', (req, res) => {
  res.send('Esta es la página "Acerca de".');
});

// Ruta para contact
app.get('/contact', (req, res) => {
    res.send('Puedes contactarnos en contacto@example.com.');
  });

app.post('/submit', (req, res) => {
  const data = req.body;
  res.json({ message: 'Datos recibidos', data });
});

// Manejo de errores
app.use((req, res, next) => {
  res.status(404).send('Lo siento, esta página no existe.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});