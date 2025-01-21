Pasos a realizar para probar mi web con un servidor en local.

Abrir una terminal en Visual Studio Code y posicionarnos en la carpeta raíz del proyecto.

Inicializar el proyecto, crea un gestor de paquetes donde tenemos las dependencias instaladas, este comando crea un archivo package.json en mi proyecto. Este archivo tiene la configuración básica de mi proyecto.
npm init -y

//ERROR en WINDOWS (Podemos tener un error en windows, ejecutamos lo siguiente en la terminal)
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Instalamos los paquetes y dependencias que necesitamos (express y cors)
npm install express
npm install cors

Tenemos que asegurarnos de haber instalado Node.js
Antes de continuar, asegúrate de que tienes Node.js instalado en tu máquina. Puedes verificarlo ejecutando este comando en la terminal:
node -v
npm -v


Ejecutar el servidor local 
node server.js

Abrir el navegador en localhost:3000 
Tenemos que poner el puerto en el que hemos definido que se esta ejecutando nuestro servidor Está configurada en server.js: 
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


Realizar pruebas y ver si nos devuelve algún error.

Importante
El nombre de mi pagina de inicio debe ser index.html sino nos devolverá un error.
Si la web nos devuelve el error de que el puerto esta ocupado, es posible que tengamos otra terminal abierta con el servidor ejecutando, es necesario cerrarla.

————————————————————————————————————————————————————————————————————————

Variables de entorno
Si mi proyecto necesita variables de entorno, como por ejemplo APIKey o configuraciones sensibles crearemos un archivo .env para almacenarlas de forma segura, para esto necesitamos tener instalado dotenv
npm install dotenv 

En el archivo nombre.env ponemos nuestra clave o datos sensible, por ejemplo 
PORT=3000 
API_KEY=tu_clave_secreta

En mi archivo server.js, añado esta dependencia y en una variable el puerto
//necesito mi archivo de configuracion de las variables de entorno
require('dotenv').config();
const port = process.env.PORT || 3000;

Puedo script para automatizar tareas, por ejemplo que el servidor se reinicio cuando estoy ejecutándolo en desarrollo, para eso necesito instalar nodemon

En el archivo package.json 
"scripts": { 
	"start": "node server.js", 
	"dev": "nodemon server.js" 
	}

npm install save-dev nodemon

npm run dev 		//para desarrollo.
npm start 		//para producción.

————————————————————————————————————————————————————————————————————————
Control de versiones en mi proyecto

Inicializar mi control de versiones
git init

Creamos un archivo .gitignore donde pondremos los archivos que no queremos que tengan el control de versiones, por ejemplo el .env o la carpeta de node_modules/
	node_modules/ 
	.env

(El nombre del archivo debe ser .gitignore, con el punto)
Ya podemos subir nuestro proyecto a GitHub

PASOS GIT
GIT add . (Añado todos los archivos a mi control de versiones, se ve que la carpeta node_modules no esta dentro de ese control)
GIT commit -m “Git inicial”
GIT status (Puedo ver el estado de mi git)
Git rm fileName Eliminar un archivo, luego hay que hacer un commit

Enlazar con GitHub 
git remote add origin git@github.com:UsuarioGitHub/Proyecto.git
git branch -M main
git push -u origin main

Herramienta postman para ver el servidor

Para mejorar la experiencia podemos instalar los plugins de Visual Studio Code:
  ESLint: Para mantener tu código limpio.
  Prettier: Para formatear tu código automáticamente.

Errores mas comunes y posibles soluciones

No encuentra /GET en el navegador, no hemos llamado index al archivo de inicio del proyecto

Problemas con JSON
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
 