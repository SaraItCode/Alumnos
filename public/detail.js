// Obtener el contenedor donde se mostrará el detalle del alumno
const detalleContainer = document.getElementById('detalle-alumno');

// Función para obtener el ID del alumno desde la URL
function getAlumnoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Función para cargar los detalles del alumno
async function cargarDetalleAlumno() {
  const id = getAlumnoId();

  if (!id) {
    detalleContainer.innerHTML = '<p>Error: No se proporcionó un ID de alumno.</p>';
    return;
  }

  try {
    // Obtener los datos de los alumnos desde el JSON
    const response = await fetch('/api/detail');
    console.log("response")
    const alumnos = await response.json();

    // Buscar el alumno por ID
    const alumno = alumnos.find((al) => al.id == id);

    if (!alumno) {
      detalleContainer.innerHTML = '<p>Error: Alumno no encontrado.</p>';
      return;
    }

    // Renderizar los detalles del alumno
    detalleContainer.innerHTML = `
      <img src="${alumno.photo}" alt="Foto de ${alumno.name}">
      <h2>${alumno.name}</h2>
      <p><strong>Edad:</strong> ${alumno.age}</p>
      <p><strong>Email:</strong> ${alumno.email}</p>
      <p><strong>Descripción:</strong> ${alumno.description}</p>
    `;
  } catch (error) {
    detalleContainer.innerHTML = '<p>Error al cargar los datos del alumno.</p>';
    console.error(error);
  }
}

// Ejecutar la función para cargar el detalle
cargarDetalleAlumno();
