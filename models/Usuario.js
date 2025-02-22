const connection = require('../db');

class Usuario {
  // Crear un nuevo usuario
  static crear(nombre, edad, email, callback) {
    const query = 'INSERT INTO usuarios (nombre, edad, email) VALUES (?, ?, ?)';
    connection.query(query, [nombre, edad, email], callback);
  }

  // Obtener todos los usuarios
  static obtenerTodos(callback) {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, callback);
  }

  // Obtener un usuario por ID
  static obtenerPorId(id, callback) {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }

  // Actualizar un usuario
  static actualizar(id, nombre, edad, email, callback) {
    const query = 'UPDATE usuarios SET nombre = ?, edad = ?, email = ? WHERE id = ?';
    connection.query(query, [nombre, edad, email, id], callback);
  }

  // Eliminar un usuario
  static eliminar(id, callback) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }
}

module.exports = Usuario;