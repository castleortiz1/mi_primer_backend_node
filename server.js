// Importar Express
const express = require('express');

// Crear una aplicación Express
const app = express();

// Definir una ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! Este es mi primer servidor backend.');
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});