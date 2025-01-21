//import alumnos from './api/alumnos.json' assert { type: 'json' };
const alumnosList = document.getElementById('alumnos-list');

async function cargarAlumnos() {
  const response = await fetch('/api/alumnos');

  const alumnos = await response.json();

  alumnosList.innerHTML = '';
  alumnos.forEach((alumno) => {
    const alumnoCard = document.createElement('div');
    alumnoCard.classList.add('alumno-card');
    alumnoCard.innerHTML = `
      <img src="${alumno.photo}" alt="${alumno.name}">
      <h2>${alumno.name}</h2>
      <a href="detail.html?id=${alumno.id}">Ver Detalle</a>
     
      <button onclick="marcarAsistencia(${alumno.id})">Marcar Asistencia</button>
    `;
     // <button onclick="verDetalle(${alumno.id})">Ver Detalle</button>
    alumnosList.appendChild(alumnoCard);
  });
}

cargarAlumnos();

  function marcarAsistencia(id) {
    let asistencia = JSON.parse(localStorage.getItem('asistencia')) || [];
    if (!asistencia.includes(id)) {
      asistencia.push(id);
      localStorage.setItem('asistencia', JSON.stringify(asistencia));
      alert('Asistencia marcada');
    } else {
      alert('Este alumno ya está en la lista de asistencia');
    }
  }

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
  