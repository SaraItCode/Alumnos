document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Crea el FormData a partir del formulario
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const age = formData.get('age');
    const email = formData.get('email');
    const details = formData.get('details');
  try {

    const response = await fetch('/upload_datos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name,age,email,details})//formData // Envía el FormData directamente
    });
    if (response.ok) {
      document.getElementById('mensaje').textContent = 'Alumno añadido correctamente.';
      setTimeout(() => {
        window.location.href = 'index.html'; // Redirige al listado de alumnos.
      }, 2000);
    } else {
      const error = await response.text();
      document.getElementById('mensaje').textContent = `Error al añadir el alumno: ${error}`;
    }
  } catch (err) {
    document.getElementById('mensaje').textContent = `Error de conexión: ${err.message}`;
  }
});
