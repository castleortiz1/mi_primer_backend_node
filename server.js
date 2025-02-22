require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const Usuario = require('./models/Usuario');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Configurar Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ruta para servir el formulario de registro/login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas públicas
app.post('/registro', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('edad').isInt({ min: 1 }).withMessage('La edad debe ser un número positivo'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], upload.single('foto'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, edad, email, contraseña } = req.body;
        const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        Usuario.crear(nombre, edad, email, hashedPassword, fotoUrl, (err, results) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                res.status(500).json({ error: 'Error al crear el usuario' });
            } else {
                res.status(201).json({ 
                    id: results.insertId, 
                    nombre, 
                    edad, 
                    email,
                    fotoUrl 
                });
            }
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    
    Usuario.obtenerPorEmail(email, async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = results[0];
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        
        if (contraseñaValida) {
            const token = jwt.sign(
                { id: usuario.id, role: usuario.role || 'user' },
                process.env.JWT_SECRET || 'secreto',
                { expiresIn: '1h' }
            );
            res.json({ 
                token, 
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    role: usuario.role || 'user'
                }
            });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    });
});

// Router para rutas protegidas
const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Rutas protegidas
apiRouter.get('/usuarios', (req, res) => {
    Usuario.obtenerTodos((err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        } else {
            res.json(results);
        }
    });
});

apiRouter.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    Usuario.obtenerPorId(id, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});

apiRouter.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, edad, email } = req.body;
    Usuario.actualizar(id, nombre, edad, email, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        } else {
            res.json({ id, nombre, edad, email });
        }
    });
});

apiRouter.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    Usuario.eliminar(id, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else {
            res.status(204).send();
        }
    });
});

// Montar el router de API
app.use('/api', apiRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});