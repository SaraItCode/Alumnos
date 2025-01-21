//Hago referencia a las dependencias que necesito
const express = require('express');
const cors = require('cors');

//Necesito trabajar con ficheros
const fs = require('fs');
const app = express();

//necesito mi archivo de configuracion de las variables de entorno
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Carpeta con los archivos estáticos (HTML, CSS, JS)

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

// Añadir un nuevo alumno
app.post('/api/new', (req, res) => {
  const newAlumno = req.body;
  fs.readFile('data/alumnos.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo el archivo');
    const alumnos = JSON.parse(data);
    alumnos.push(newAlumno);
    fs.writeFile('data/alumnos.json', JSON.stringify(alumnos, null, 2), (err) => {
      if (err) return res.status(500).send('Error escribiendo el archivo');
      res.send({ message: 'Alumno añadido' });
    });
  });
});

app.listen(port, () => console.log('Servidor corriendo en http://localhost:3000'));
