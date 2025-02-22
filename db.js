// db.js
const mysql = require('mysql2');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Dirección del servidor MySQL
  user: 'root', // Usuario de MySQL
  password: 'Pandora15@-L', // Contraseña de MySQL
  database: 'mi_primer_backend', // Nombre de la base de datos
  port: '3301' // 
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

module.exports = connection;