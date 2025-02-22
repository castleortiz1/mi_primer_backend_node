const express = require('express');
const Usuario = require('./models/Usuario');
const app = express();

app.use(express.json());

// Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { nombre, edad, email } = req.body;
  Usuario.crear(nombre, edad, email, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    } else {
      res.status(201).json({ id: results.insertId, nombre, edad, email });
    }
  });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  Usuario.obtenerTodos((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  Usuario.obtenerPorId(id, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Actualizar un usuario
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, edad, email } = req.body;
  Usuario.actualizar(id, nombre, edad, email, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json({ id, nombre, edad, email });
    }
  });
});

// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  Usuario.eliminar(id, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(204).send();
    }
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});