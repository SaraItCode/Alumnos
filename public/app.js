// Verificar si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/perfil');
    const userData = await response.json();

    if (userData.username) {
      document.getElementById('noAuth').style.display = 'none';
      document.getElementById('auth').style.display = 'block';
      document.getElementById('username').textContent = userData.username;
    } else {
      document.getElementById('noAuth').style.display = 'block';
      document.getElementById('auth').style.display = 'none';
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
  }
});

// Función para cerrar sesión
async function logout() {
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión');
  }
}
// Asegurarme que la funcion logout esta definida
window.logout = logout;
//import alumnos from './api/alumnos.json' assert { type: 'json' };
const alumnosList = document.getElementById('alumnos-list');

function marcarAsistencia(id) {
  console.log(`MArcar asistencia ${id}`);
  let asistencia = JSON.parse(localStorage.getItem('asistencia')) || [];
  if (!asistencia.includes(id)) {
    asistencia.push(id);
    localStorage.setItem('asistencia', JSON.stringify(asistencia));
    alert('Asistencia marcada');
  } else {
    alert('Este alumno ya está en la lista de asistencia');
  }
}
async function cargarAlumnos() {
  const response = await fetch('/api/alumnos');

  const alumnos = await response.json();

  alumnosList.innerHTML = '';
  alumnos.forEach((alumno) => {
    const alumnoCard = document.createElement('div');
    alumnoCard.classList.add('alumno-card');
    alumnoCard.innerHTML = `
      <img class="image_profile" src="${alumno.photo}" alt="${alumno.name}" loading="lazy">
      <h2>${alumno.name}</h2>
      <a href="detail.html?id=${alumno.id}">Ver Detalle</a>
      <button id="asistencia-${alumno.id}">Marcar Asistencia</button>
    `;
    // // Redirigir a detalle.html con el ID del alumno
    // tarjeta.addEventListener('click', () => {
    //   window.location.href = `detalle.html?id=${alumno.id}`;
    // });
     // <button onclick="verDetalle(${alumno.id})">Ver Detalle</button>
    alumnosList.appendChild(alumnoCard);
    // Asignar evento al botón
    const boton = document.getElementById(`asistencia-${alumno.id}`);
    boton.addEventListener("click", () => marcarAsistencia(alumno.id));
  
  });
}

cargarAlumnos();

async function cargarAsistencia() {
  const asistencia = JSON.parse(localStorage.getItem('asistencia')) || [];
  const response = await fetch('/api/alumnos');
  const alumnos = await response.json();

  const asistenciaAlumnos = alumnos.filter((alumno) => asistencia.includes(alumno.id));
  const asistenciaList = document.getElementById('asistencia-list');
  asistenciaList.innerHTML = asistenciaAlumnos
    .map(
      (alumno) => `
        <div class="asistencia-card">
          <img src="${alumno.photo}" alt="${alumno.name}">
          <h2>${alumno.name}</h2>
          <button onclick="eliminarDeAsistencia(${alumno.id})">Eliminar</button>
        </div>
      `
    )
    .join('');
}
  
function eliminarDeAsistencia(id) {
  let asistencia = JSON.parse(localStorage.getItem('asistencia')) || [];
  asistencia = asistencia.filter((alumnoId) => alumnoId !== id);
  localStorage.setItem('asistencia', JSON.stringify(asistencia));
  cargarAsistencia();
}

function eliminarTodaAsistencia() {
  localStorage.removeItem('asistencia');
  cargarAsistencia();
}
  