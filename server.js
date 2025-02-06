// Hago referencia a las dependencias que necesito
const express = require('express');
const cors = require('cors');

// Necesito mi archivo de configuracion de las variables de entorno
require('dotenv').config();
const port = process.env.PORT || 3000;

// Usamos una base de datos
const db = require('./database');

// Subir imagenes
const multer = require('multer');
const path = require('path');

// Define la ruta completa a la carpeta 'uploads'
const uploadDir = path.join(__dirname, 'uploads');

// Necesito trabajar con ficheros
const fs = require('fs');
const bodyParser = require('body-parser');

// Verifica si la carpeta existe y créala si no está presente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db' }), // Almacena sesiones en SQLite
  secret: 'XASDWERTY', // Poner una clave segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambia a true si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 día de duración    // 3600000 // 1 hora
  }
}));

// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
// indico que usa todas los paquetes del proyecto
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Carpeta con los archivos estáticos (HTML, CSS, JS)

// Configurar carpeta de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que esta ruta sea válida, ruta donde se guardan las imagenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
  }
});

// Middleware de Multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF.'));
  }
});

// ENDPOINTS //
// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sabetr quien es el usuario que se ha logeado
app.get('/api/perfil', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json({});
  }
});

//Formulario normal
app.post('/upload_datos', (req, res) => {
  const { name, age, email, details } = req.body;
  // Crea un nuevo alumno
  const newAlumno = {
    id: Date.now(),
    name,
    age,
    email,
    details
  };
  // Guarda la información en un archivo JSON
  const filePath = './data/usuarios.json';
  const alumnos = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];
  // Comprobar si el email ya existe
  let existe = alumnos.includes(newAlumno.email);
  if (existe) res.status(500).send('El alumno ya esta registrado.');
  alumnos.push(newAlumno);
  fs.writeFileSync(filePath, JSON.stringify(alumnos, null, 2));

  res.status(200).send('Alumno añadido correctamente.');
})

// Endpoint para subir un nuevo alumno, con  una foto (multipart/form-data)
app.post('/upload', upload.single('photo'), (req, res) => {
  const { name, age, email, description } = req.body;
  if (!req.file) {
    return res.status(400).send('No se ha subido ninguna foto.');
  }
  // Crea un nuevo alumno
  const newAlumno = {
    id: Date.now(),
    name,
    age,
    email,
    photo: `/uploads/${req.file.filename}`,
    description
  };
  // Guarda la información en un archivo JSON
  const filePath = './data/alumnos.json';
  const alumnos = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];
  alumnos.push(newAlumno);
  fs.writeFileSync(filePath, JSON.stringify(alumnos, null, 2));

  res.status(200).send('Alumno añadido correctamente.');
});

// Servir archivos subidos
app.use('/uploads', express.static('uploads'));
app.get("/uploads", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la carpeta" });
    }
    res.json({ archivos: files });
  });
});

//Eliminar un archivo
app.delete("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar el archivo" });
    }
    res.json({ mensaje: "Archivo eliminado correctamente" });
  });
});

// TODO --> Lo llamo desde mi parte publica
// fetch("/uploads/nombre-del-archivo.jpg", { method: "DELETE" })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// Leer el JSON
app.get('/api/alumnos', (req, res) => {
  fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo el archivo');
    res.send(JSON.parse(data));
  });
});

// // Detail alumno
// app.get('/api/detail', (req, res) => {
//     fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
//       if (err) return res.status(500).send('Error leyendo el archivo');
//       res.send(JSON.parse(data));
//     });
// });
// Obtener detalle de un alumno por ID
app.get('/api/alumnos/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo el archivo');
    //Busco el id 
    let all = JSON.parse(data);
    let search = all.find((al) => al.id == id)
    res.send(search);
  });
  // db.get('SELECT * FROM alumnos WHERE id = ?', [id], (err, row) => {
  //   if (err) res.status(500).json({ error: err.message });
  //   else res.json(row);
  // });
});

// Ruta para agregar un alumno a la BD
app.post('/add-alumno', (req, res) => {
  const { name, age, email, photo } = req.body;
  db.run(`INSERT INTO alumnos (name, age, email, photo) VALUES (?, ?, ?, ?)`,
    [name, age, email, photo], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

// Necesito esta libreria para codificar el password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Registro de usuario, añadido a la BD
app.post('/api/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // Verificar si el usuario ya existe
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
      if (err) throw err;
      
      if (row) {
        return res.status(400).json({ error: 'El usuario o correo ya existe' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insertar nuevo usuario
      db.run(
        'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
        [name, username, email, hashedPassword],
        (err) => {
          if (err) throw err;
          res.status(201).json({ success: true });
        }
      );
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Buscar usuario
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Comparar contraseñas
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Login exitoso (aquí podrías añadir sesiones o JWT)
    //Actualizar la ultima vez que se ha logeado 
    db.get('UPDATE users SET last_login_date = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    // Guardar el usuario en la sesión
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    res.status(200).json({ success: true });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).json({ error: 'Error al cerrar sesión' });
    else res.clearCookie('connect.sid').json({ success: true });
  });
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));

// // Ejemplo en routes.js, usar en rutas protegidas
// const isAuthenticated = require('./authMiddleware');

// router.get('/api/perfil', isAuthenticated, (req, res) => {
//   res.json(req.session.user);
// });

// TODO --> Mejoras con el login
//npm install express-session
/***
const session = require('express-session');

app.use(session({
  secret: 'tu_clave',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

 */

// TODO --> Poner https en nuestro proyecto.