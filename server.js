// Hago referencia a las dependencias que necesito
const express = require('express');
const cors = require('cors');
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

// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Necesito mi archivo de configuracion de las variables de entorno
require('dotenv').config();
const port = process.env.PORT || 3000;

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

// Ruta para subir alumno (multipart/form-data)
app.post('/upload', upload.single('profilePic'), (req, res) => {
  const { name, age, email } = req.body;

  if (!req.file) {
    return res.status(400).send('No se ha subido ninguna foto.');
  }

  // Crea un nuevo alumno
  const newAlumno = {
    id: Date.now(),
    name,
    age,
    email,
    photo: `/uploads/${req.file.filename}`
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

// Leer el JSON
app.get('/api/alumnos', (req, res) => {
  fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo el archivo');
    res.send(JSON.parse(data));
  });
});

// Detail alumno
app.get('/api/detail', (req, res) => {
    fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
      if (err) return res.status(500).send('Error leyendo el archivo');
      res.send(JSON.parse(data));
    });
});

// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Manejo de errores
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(port, () => console.log('Servidor corriendo en http://localhost:3000'));
