Instalar en la raiz del proyecto
npm init -y

//ERROR en WINDOWS
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

npm install express
npm install cors

1. Asegúrate de haber instalado Node.js
Antes de continuar, asegúrate de que tienes Node.js instalado en tu máquina. Puedes verificarlo ejecutando este comando en la terminal:

node -v
npm -v

npm init -y
Esto creará un archivo package.json con la configuración básica del proyecto.

Inicializar el servidor
node server.js

Si usas nodemon (para reiniciar automáticamente el servidor cuando se hagan cambios), primero instala nodemon de forma global:
npm install -g nodemon
Luego, inicia el servidor con:
nodemon server.js

Herramienta postman para ver el servidor

Para mejorar la experiencia, asegúrate de tener los siguientes plugins instalados en Visual Studio Code:

ESLint: Para mantener tu código limpio.
Prettier: Para formatear tu código automáticamente.

Además, puedes configurar un script en tu package.json para iniciar el servidor más fácilmente. Por ejemplo:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
Ahora puedes iniciar el servidor con:
npm run dev

Si intentas usar res.send() en lugar de res.json(), debes asegurarte de convertir el objeto en un string JSON:
res.send(JSON.stringify(data)); // Convertir manualmente.

Ejemplo Express
app.get('/data', (req, res) => {
  const data = {
    nombre: "Juan",
    edad: 25
  };
  res.json(data); // Envia JSON válido automáticamente.
});

Si Usas import para JSON
Recuerda que necesitas:
"type": "module" en tu package.json.
JSON válido.
import superheroes from './data/superheroes.json' assert { type: 'json' };
 