// Obtener el contenedor donde se mostrará el detalle del alumno
const detalleContainer = document.getElementById('detalle-alumno');

// Función para cargar los detalles del alumno
async function cargarDetalleAlumno() {
  // Función para obtener el ID del alumno desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    alert('Alumno no encontrado');
    window.location.href = '/alumnos';
    return;
  }
 
  // if (!id) {
  //   detalleContainer.innerHTML = '<p>Error: No se proporcionó un ID de alumno.</p>';
  //   return;
  // }

  try {
    // Obtener los datos de los alumnos desde el JSON
    const response = await fetch(`/api/alumnos/${id}`);
    const alumno = await response.json();

    // // Buscar el alumno por ID
    // const alumno = alumnos.find((al) => al.id == id);

    if (!alumno) {
      detalleContainer.innerHTML = '<p>Error: Alumno no encontrado.</p>';
      return;
    }

    // Renderizar los detalles del alumno
    detalleContainer.innerHTML = `
      <img src="uploads/ironman.png" alt="Foto de ${alumno.name}">
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
