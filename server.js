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

// Ruta para manejar la subida de archivos y guardar datos en un archivo JSON
app.post('/upload', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  
  // Extraer datos del formulario
  const { name, age, email } = req.body;
  const profilePic = `./uploads/${req.file.filename}`;

  // Crear un objeto con los datos del usuario
  const newUser = { name, age, email, profilePic };

  // Ruta del archivo JSON
  //const jsonFilePath = path.join(__dirname, 'alumnos.json'); -----REVISAR

  // Leer y actualizar el archivo JSON
  fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).send('Error al leer el archivo JSON.');
    }

    const users = data ? JSON.parse(data) : []; // Si el archivo no existe, inicializar con un array vacío
    users.push(newUser);

    // Guardar los datos actualizados
    fs.writeFile('data/alumnos.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar los datos en el archivo JSON.');
      }

      // Responder con los datos del usuario
      res.send(`
        <h1>Datos guardados con éxito</h1>
        <p>Nombre: ${name}</p>
        <p>Age: ${age}</p>
        <p>Correo Electrónico: ${email}</p>
        <p>Foto:</p>
        <img src="/uploads/${profilePic}" alt="Foto de perfil" style="max-width: 200px;">
      `);
      // Redirigir a lal pagina de inicio ---- REVISAR
      //res.redirect(`/?name=${name}&email=${email}&profilePic=${req.file.filename}`);
    });
  });
});

// // Ruta para manejar la subida de archivos
// app.post('/upload', upload.single('profilePic'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No se subió ningún archivo.');
//   }

//   res.send(`
//     <h1>Foto subida con éxito</h1>
//     <p>Nombre del archivo: ${req.file.filename}</p>
//     <img src="/uploads/${req.file.filename}" alt="Foto de perfil" style="max-width: 200px;">
//   `);
// });

// Servir archivos subidos
app.use('/uploads', express.static('uploads'));

// Leer el JSON
app.get('/api/alumnos', (req, res) => {
  fs.readFile('data/alumnods.json', 'utf-8', (err, data) => {
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

// // Añadir un nuevo alumno
// app.post('/api/new', (req, res) => {
//   const newAlumno = req.body;
//   fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
//     if (err) return res.status(500).send('Error leyendo el archivo');
//     const alumnos = JSON.parse(data);
//     alumnos.push(newAlumno);
//     fs.writeFile('data/alumnos.json', JSON.stringify(alumnos, null, 2), (err) => {
//       if (err) return res.status(500).send('Error escribiendo el archivo');
//       res.send({ message: 'Alumno añadido' });
//     });
//   });
// });

// Ruta para servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Manejo de errores
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(port, () => console.log('Servidor corriendo en http://localhost:3000'));







