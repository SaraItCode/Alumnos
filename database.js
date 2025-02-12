const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('informacion.db'); // Crea un archivo de base de datos

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    email TEXT,
    photo TEXT
  )`);
  // Crear tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_date DEFAULT CURRENT_TIMESTAMP,
      last_login_date DEFAULT CURRENT_TIMESTAMP,
      isAdmin BOOLEAN DEFAULT 0
    )
  `);
  db.run(`
    UPDATE TABLE users set isAdmin=1 where email="s.ortegamunoz@gmail.com"
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
