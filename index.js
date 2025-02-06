//Archivo que si se ejecuta en la terminal node index.js me puede ayudar a probar si funciona mi bd.
// Es necesario cambiar los nombres por los de mi proyecto.
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('informacion.db'); // Nombre de la bd

db.serialize(() => {
    // Poner la tabla que quiero crear y sus campos.
    db.run("CREATE TABLE IF NOT EXISTS alumnos (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT, photo TEXT)");
    db.run("INSERT INTO alumnos (name,age,email) VALUES (?,?,?)", ["Juan",23,"email@mail.com"]);
    // Modificar la informacion que muestra, con los valores de mi tabla.
    db.each("SELECT * FROM alumnos", (err, row) => {
        console.log(row.id + ": " + row.name + ": " + row.age + ": " + row.email + ": " + row.photo);
    });
});

db.close();