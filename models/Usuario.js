// models/Usuario.js
const connection = require('../db');

class Usuario {
  static crear(nombre, edad, email, contraseña, foto_url = null, callback) {
    const query = 'INSERT INTO usuarios (nombre, edad, email, contraseña, foto_url) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nombre, edad, email, contraseña, foto_url], callback);
  }

  static obtenerTodos(callback) {
    const query = 'SELECT id, nombre, edad, email, foto_url, role FROM usuarios';
    connection.query(query, callback);
  }

  static obtenerPorId(id, callback) {
    const query = 'SELECT id, nombre, edad, email, foto_url, role FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }

  static obtenerPorEmail(email, callback) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], callback);
  }

  static actualizar(id, nombre, edad, email, foto_url = null, callback) {
    const query = 'UPDATE usuarios SET nombre = ?, edad = ?, email = ?, foto_url = ? WHERE id = ?';
    connection.query(query, [nombre, edad, email, foto_url, id], callback);
  }

  static eliminar(id, callback) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }
}

module.exports = Usuario;